const path = require('path');
const fs = require('fs');
const { Op, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { generateResponse } = require('../config/generateResponse');
const {
  Contract,
  ContractAttachFile,
  ContractSubFile,
  ContractParticipant,
  ContractProcess,
  User,
  ContractType,
  Organization,
  ContractTypeProcessTemplate
} = require('../models');
const { contractSchema } = require('../validations/contracts');
const { isStrPositiveNum } = require('../utils/numberUtils');
const { rootDir, saveFileToDisk } = require('../utils/fileUtils');
const { convertToHyphenatedString } = require('../utils/textUtils');
const { CONTRACT_STATUS } = require('../constanst/contractStatus.constant');
const {
  findContractById,
  findContractProcessByParticipantId,
  findContractParticipantByContractId,
  createContract,
  createContractParticipant,
  createContractProcessModel,
} = require('../service/contract.service');
const {
  CONTRACT_FILE_TYPE
} = require('../constanst/contractFileType.constant');
const { logger } = require('../config/logger');
const {
  CONTRACT_PROCESS_ACTION_STATUS, CONTRACT_PROCESS_ACTION_BY
} = require('../constanst/contractProcessActionStatus.constant');
const {
  CONTRACT_PARTICIPANT_STATUS
} = require('../constanst/contractParticipantStatus.constant');
const { ContractTypeProcessTemplateSchema } = require('../validations/contractTypeProcessTemplate');

const baseContractPath = path.join(rootDir, 'uploads', 'contracts');
const { sendEmail } = require('../config/email');
const { findUserByParticipantId } = require('../service/contractParticipant.service');

const _execFile = async (
  contract,
  attachFile,
  subFiles = [],
  operation = 'create'
) => {
  let attachFileObj = null;
  let subFilesList = [];

  if (operation === 'update') {
    try {
      const files = fs.readdirSync(baseContractPath);
      files.forEach((file) => {
        if (file.startsWith(`contract-sub-${contract.id}-`)) {
          const filePath = path.join(baseContractPath, file);
          fs.unlinkSync(filePath);
        }
      });

      await ContractSubFile.destroy({
        where: { contractId: contract.id }
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (attachFile) {
    let filename = convertToHyphenatedString(
      `contract-${contract.id}-${uuidv4()}`
    );
    const filePath = path.join(baseContractPath, filename);
    await saveFileToDisk(filePath, attachFile);

    attachFileObj = await ContractAttachFile.create({
      file: filename,
      contractId: contract.id
    });

    const newFilename =
      filename + `-${uuidv4()}` + `${path.extname(attachFile.originalname)}`;
    attachFileObj.file = newFilename;
    attachFileObj.save();

    fs.renameSync(filePath, `${path.join(baseContractPath, newFilename)}`);
  }

  for (const subFile of subFiles) {
    const filename = convertToHyphenatedString(
      `contract-sub-${contract.id}-${subFile.originalname}`
    );
    const subFilePath = path.join(baseContractPath, filename);
    await saveFileToDisk(subFilePath, subFile);

    const subFileObj = await ContractSubFile.create({
      file: filename,
      contractId: contract.id
    });
    subFilesList.push(subFileObj.dataValues);
  }

  return {
    attachFile: attachFileObj,
    subFiles: subFilesList
  };
};

const _checkValidFileExt = (attachFile, subFiles) => {
  let isValidFileExt = true;
  const allowedFileExtension = process.env.ALLOWED_FILE_EXTENSION || 'pdf';
  const allowed_file_ext_regex = new RegExp(
    allowedFileExtension.split(',').join('|')
  );

  if (attachFile) {
    isValidFileExt = allowed_file_ext_regex.test(
      path.extname(attachFile.originalname).toLowerCase()
    );
  }

  for (const s of subFiles) {
    if (
      !allowed_file_ext_regex.test(path.extname(s.originalname).toLowerCase())
    ) {
      isValidFileExt = false;
    }
  }

  return isValidFileExt;
};

module.exports.getContractList = async (req, res) => {
  try {
    const {
      name,
      contractType,
      status,
      startDate1,
      startDate2,
      endDate1,
      endDate2,
      priority,
      page = 1,
      limit = 1000
    } = req.query;

    let filterConditions = {};
    let participantCondition = {};

    if (name) {
      filterConditions.name = { [Op.like]: `%${name}%` };
    }

    if (status) {
      filterConditions.status = status;
    }

    if (priority) {
      filterConditions.priority = priority;
    }

    if (startDate1 && startDate2) {
      filterConditions.startDate = {
        [Op.between]: [new Date(startDate1), new Date(startDate2)]
      };
    }
    if (endDate1 && endDate2) {
      filterConditions.endDate = {
        [Op.between]: [new Date(endDate1), new Date(endDate2)]
      };
    }

    if (contractType) {
      participantCondition.contractTypeId = contractType;
    }

    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [
          { createBy: req.user.id },
          {
            [Op.and]: [
              Sequelize.literal(`
                (SELECT contractParticipants.contractId
                 FROM contractParticipants
                 INNER JOIN contractProcesses ON contractParticipants.id = contractProcesses.contractParticipantId
                 AND contractProcesses.actionBy = ${req.user.id}
                 WHERE contractParticipants.contractId = Contract.id
                 LIMIT 1
                ) IS NOT NULL
              `),
            ]
          }
        ],
        ...filterConditions
      },
      include: [
        {
          model: ContractParticipant,
          as: 'contractParticipants',
          where: participantCondition,
          required: false,
          include: [
            {
              model: ContractProcess,
              as: 'ContractProcesses',
              required: true
            }
          ]
        }
      ],
      limit: limit,
      offset: (page - 1) * limit,
    });
    const response = [];

    for (const contract of contracts) {
      const contractTypeName = await ContractType.findOne({
        where: { id: contract.contractParticipants[0].contractTypeId }
      })
      const item = {
        id: contract.id,
        name: contract.name,
        description: contract.description,
        contractNumber: contract.contractNumber,
        status: contract.status,
        priority: contract.priority,
        contractType: contractTypeName.name,
        startDate: contract.startDate,
        endDate: contract.endDate,
        isOwner: contract.createBy === req.user.id,
        action: +contract.contractParticipants[0].ContractProcesses[0].action
      };
      response.push(item);
    }

    return res
      .status(200)
      .json(generateResponse(200, { contracts: response }, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.getContractById = async (req, res) => {
  const contractId = req.params.id;
  try {
    if (!isStrPositiveNum(contractId)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await Contract.findOne({
      where: { id: contractId },
      include: [
        {
          model: ContractAttachFile,
          where: {
            contractId: contractId
          },
          order: [['createdAt', 'DESC']],
          limit: 1
        },
        {
          model: ContractSubFile,
          required: false,
          where: {
            contractId: contractId
          }
        },
        {
          model: ContractParticipant,
          as: 'contractParticipants',
          include: [
            {
              model: Organization,
            }
          ],
          required: false,
        }
      ]
    });

    if (!contract) {
      return res
        .status(404)
        .json(
          generateResponse(
            404,
            {},
            `Contract with id=${contractId} not found`,
            {}
          )
        );
    }
    const contractTypeName = await ContractType.findOne({
      where: {
        id: contract.contractParticipants[0].contractTypeId
      },
      attributes: ['name'],
      include: [
        {
          model: ContractTypeProcessTemplate,
          as: 'ContractTypeProcessTemplates',
          required: false
        }
      ]
    })
    return res.status(200).json(generateResponse(200, { contract, contractTypeName }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.createContract = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      contractNumber,
      priority,
      startDate,
      endDate,
      contractParticipantInput,
      contractProcessInput
    } = req.body;

    const attachFile = req.files['attachFile']
      ? req.files['attachFile'][0]
      : null;

    const subFiles = Object.entries(req.files).reduce((l, [key, files]) => {
      if (key !== 'attachFile') l.push(...files);
      return l;
    }, []);

    const { error, value } = contractSchema.validate(req.body);
    const { id } = req.user;
    if (error) {
      return res
        .status(400)
        .json(
          generateResponse(
            400,
            null,
            error.details[0].message,
            error.details[0]
          )
        );
    }

    if (!attachFile) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Attach file is required', {}));
    }

    if (!_checkValidFileExt(attachFile, subFiles)) {
      return res
        .status(400)
        .json(
          generateResponse(
            400,
            null,
            `Wrong file extension format, must be ${process.env.ALLOWED_FILE_EXTENSION}`,
            {}
          )
        );
    }

    // Kiểm tra array
    if (!contractParticipantInput.startsWith('[')) {
      return res
        .status(200)
        .json(
          generateResponse(
            -100,
            'contractParticipantInput is not an array',
            '',
            {}
          )
        );
    }

    if (!contractProcessInput.startsWith('[')) {
      return res
        .status(200)
        .json(
          generateResponse(-101, 'contractProcessInput is not an array', '', {})
        );
    }

    // Chuyển từ string thành JSON
    const contractParticipantValidate = JSON.parse(contractParticipantInput);
    const contractProcessInputValidate = JSON.parse(contractProcessInput);

    const contract = await createContract(
      {
        name,
        description,
        status,
        contractNumber,
        priority,
        startDate,
        endDate
      },
      id
    );

    const contractParticipantInsert = contractParticipantValidate.map((e) => {
      e.contractId = contract.dataValues.id;
      e.userId = id;
      e.isCreated = e.isCreated || 0;
      e.contractTypeId = e.contractTypeId;
      e.signatureUrl = '';
      e.status = 0;
      return e;
    });

    const contractParticipant = await createContractParticipant(
      contractParticipantInsert
    );

    const contractParticipantCreatedId = contractParticipant.find((e) => {
      return e.dataValues.isCreated == 1;
    }).id;

    const contractProcessInsertData = contractProcessInputValidate.map((e) => {
      e.contractParticipantId = contractParticipantCreatedId;
      e.actionBy = Number(e.actionBy);
      e.optional = 0;
      return e;
    });

    await createContractProcessModel(contractProcessInsertData);
    const fileResult = await _execFile(contract, attachFile, subFiles);

    const result = {
      ...fileResult
    };

    return res.status(200).json(generateResponse(200, 'INSERT DONE', '', {}));
  } catch (err) {
    console.error(err);
    logger.error(err.message);
    return res.status(500).json(generateResponse(500, {}, 'Unknown Error'));
  }
};

module.exports.updateContractById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      contractParticipantInput,
      contractProcessInput
    } = req.body;
    const { error, value } = contractSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json(
          generateResponse(
            400,
            null,
            error.details[0].message,
            error.details[0]
          )
        );
    }

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await Contract.findOne({
      where: { id }
    });

    if (!contract) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }
    // Kiểm tra array
    if (!contractParticipantInput.startsWith('[')) {
      return res
        .status(200)
        .json(
          generateResponse(
            -100,
            'contractParticipantInput is not an array',
            '',
            {}
          )
        );
    }
    if (!contractProcessInput.startsWith('[')) {
      return res
        .status(200)
        .json(
          generateResponse(-101, 'contractProcessInput is not an array', '', {})
        );
    }
    const userId = req.user.id;
    // Chuyển từ string thành JSON
    const contractPaticipantValidate = JSON.parse(contractParticipantInput);
    const contractProcessInputValidate = JSON.parse(contractProcessInput);
    await Contract.update(
      {
        name: value.name,
        description: value.description,
        status: value.status,
        contractNumber: value.contractNumber,
        priority: value.priority,
        startDate: value.startDate,
        endDate: value.endDate,
        createBy: userId
      },
      {
        where: {
          id: id
        }
      }
    );
    await ContractParticipant.destroy({
      where: { contractId: id }
    });

    const contractParticipantInsert = contractPaticipantValidate.map((e) => {
      e.contractId = id;
      e.userId = userId;
      e.isCreated = e.isCreated || 0;
      return e;
    });

    const contractParticipant = await createContractParticipant(
      contractParticipantInsert
    );
    const contractParticipantCreatedId = contractParticipant.find((e) => {
      return e.dataValues.isCreated == 1;
    }).id;

    const contractProcessInsertData = contractProcessInputValidate.map((e) => {
      e.contractParticipantId = contractParticipantCreatedId;
      return e;
    });

    await createContractProcessModel(contractProcessInsertData);

    return res
      .status(200)
      .json(generateResponse(200, `Contract with id = ${id} is updated`, {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.deleteContractById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await Contract.findOne({
      where: { id }
    });

    if (!contract) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    await contract.destroy();
    await ContractParticipant.destroy({
      where: { contractId: id }
    });
    return res
      .status(200)
      .json(generateResponse(200, {}, `Contract with id=${id} is deleted`, {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.cancelContract = async (req, res) => {
  try {
    const { id } = req.body;

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await findContractById(id);

    if (!contract) {
      return res
        .status(200)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    if (contract.status != CONTRACT_STATUS.NEW) {
      return res
        .status(200)
        .json(
          generateResponse(405, {}, `Contract with id=${id} is not new one`, {})
        );
    }

    contract.status = CONTRACT_STATUS.CANCEL;
    await contract.save();

    const result = { ...contract.dataValues };

    return res
      .status(200)
      .json(
        generateResponse(200, result, `Contract with id=${id} is cancelled`, {})
      );
  } catch (error) {
    logger.error('Error cancelling contract:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};

module.exports.searchEntity = async (req, res) => {
  try {
    const { type, identifier } = req.body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid identifier', {}));
    }

    let result;
    if (type === 'user') {
      result = await User.findOne({ where: { idNumber: identifier } });
      if (!result) {
        return res
          .status(200)
          .json(
            generateResponse(
              404,
              {},
              `User with identifier=${identifier} not found`,
              {}
            )
          );
      }
    } else if (type === 'organization') {
      result = await Organization.findOne({ where: { taxCode: identifier } });
      if (!result) {
        return res
          .status(200)
          .json(
            generateResponse(
              404,
              {},
              `Organization with identifier=${identifier} not found`,
              {}
            )
          );
      }
    } else {
      return res
        .status(200)
        .json(
          generateResponse(
            400,
            null,
            'Invalid type. Must be "user" or "organization"',
            {}
          )
        );
    }

    const { name, address, phone, email, representative } = result;

    const responseData = {
      name,
      address,
      phone,
      email,
      representative
    };

    return res
      .status(200)
      .json(
        generateResponse(
          200,
          responseData,
          `${type.charAt(0).toUpperCase() + type.slice(1)
          } with identifier=${identifier} is found`,
          {}
        )
      );
  } catch (error) {
    logger.error('Error searching entity:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};

module.exports.startSign = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await findContractById(id);

    if (!contract) {
      return res
        .status(200)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    if (contract.status !== CONTRACT_STATUS.NEW) {
      return res
        .status(200)
        .json(
          generateResponse(405, {}, `Contract with id=${id} is not new`, {})
        );
    }

    const contractParticipant = await findContractParticipantByContractId(id);

    if (!contractParticipant) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No participants found for contract with id=${id}`,
            {}
          )
        );
    }

    const contractProcess = await findContractProcessByParticipantId(
      contractParticipant.id
    );

    if (!contractProcess) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No contract process found for participant with id=${contractParticipant.id}`,
            {}
          )
        );
    }

    contract.status = CONTRACT_STATUS.SIGNING;
    await contract.save();
    contractProcess.actionStatus = CONTRACT_PROCESS_ACTION_STATUS.SIGNED;
    await contractProcess.save();

    const participants = await ContractParticipant.findAll({
      where: { contractId: id }, 
      attributes: ['userId'] 
    });

    const userIds = participants.map(participant => participant.userId);

    const users = await User.findAll({
      where: { id: userIds }
    });

    for (const user of users) {
      const emailOptions = {
        to: user.email,
        subject: "THÔNG BÁO XÁC NHẬN HỢP ĐỒNG ĐIỆN TỬ",
        html: `<p>Kính gửi ông/bà : <b></b><br>
               <p> Chúng tôi đã xuất hợp đồng điện tử cho Quý khách hàng. Thông tin hợp đồng đã được lưu trên website:</p>
               <p>Nhằm tạo điều kiện thuận lợi cho Quý khách hàng tra cứu, xem hợp đồng điện tử.</p>
               <p>Chúng tôi xin gửi tới khách hàng hướng dẫn như sau:</p>
               <p>Bước 1: Vào website: http://localhost:4380/contract <br>
               Bước 2: Đăng nhập vào website: http://localhost:4380/contract <br>
               Bước 3: Chọn mục quản lý hợp đồng <br>
               Bước 4: Thực hiện hành động ký, duyệt</p>
               <p>Chúng tôi xin trân trọng cảm ơn Quý khách hàng đã tin tưởng sử dụng và hợp tác với giải pháp hợp đồng điện tử.<br>
               Mọi vướng mắc về phần mềm vui lòng liên hệ theo số 091111111 hoặc website: http://localhost:4380/contract để được giải quyết nhanh nhất !!</p>`
      };

      await sendEmail(emailOptions);
    }

    return res
      .status(200)
      .json(
        generateResponse(200, `Contract with id=${id} has started signing and emails have been sent to participants`, {})
      );
  } catch (error) {
    logger.error('Error starting signing contract:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};

module.exports.approveContract = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await findContractById(id);

    if (!contract) {
      return res
        .status(200)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    if (contract.status !== CONTRACT_STATUS.SIGNING) {
      return res
        .status(200)
        .json(
          generateResponse(
            405,
            {},
            `Contract with id=${id} is not in signing status`,
            {}
          )
        );
    }

    const contractParticipant = await findContractParticipantByContractId(id);

    if (!contractParticipant) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No participants found for contract with id=${id}`,
            {}
          )
        );
    }

    const contractProcess = await findContractProcessByParticipantId(
      contractParticipant.id
    );

    if (!contractProcess) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No contract process found for participant with id=${contractParticipant.id}`,
            {}
          )
        );
    }

    contractProcess.actionStatus = CONTRACT_PROCESS_ACTION_STATUS.APPROVED;
    await contractProcess.save();

    contractParticipant.status = CONTRACT_PARTICIPANT_STATUS.APPROVED;
    await contractParticipant.save();

    const participants = await ContractParticipant.findAll({
      where: { contractId: id }, 
      attributes: ['userId'] 
    });

    const userIds = participants.map(participant => participant.userId);

    const users = await User.findAll({
      where: { id: userIds }
    });

    for (const user of users) {
      const emailOptions = {
        to: user.email,
        subject: "THÔNG BÁO XÁC NHẬN HỢP ĐỒNG ĐIỆN TỬ",
        html: `<p>Kính gửi ông/bà : <b></b><br>
               <p> Chúng tôi đã xuất hợp đồng điện tử cho Quý khách hàng. Thông tin hợp đồng đã được lưu trên website:</p>
               <p>Nhằm tạo điều kiện thuận lợi cho Quý khách hàng tra cứu, xem hợp đồng điện tử.</p>
               <p>Chúng tôi xin gửi tới khách hàng hướng dẫn như sau:</p>
               <p>Bước 1: Vào website: http://localhost:4380/contract <br>
               Bước 2: Đăng nhập vào website: http://localhost:4380/contract <br>
               Bước 3: Chọn mục quản lý hợp đồng <br>
               Bước 4: Thực hiện hành động ký, duyệt</p>
               <p>Chúng tôi xin trân trọng cảm ơn Quý khách hàng đã tin tưởng sử dụng và hợp tác với giải pháp hợp đồng điện tử.<br>
               Mọi vướng mắc về phần mềm vui lòng liên hệ theo số 091111111 hoặc website: http://localhost:4380/contract để được giải quyết nhanh nhất !!</p>`
      };

      await sendEmail(emailOptions);
    }

    return res
      .status(200)
      .json(
        generateResponse(
          200,
          {},
          `The approving action for the contract with id=${id} was performed successfully`,
          {}
        )
      );
  } catch (error) {
    logger.error('Error approving contract:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};

module.exports.signContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { signatureUrl } = req.body;

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await findContractById(id);

    if (!contract) {
      return res
        .status(200)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    if (contract.status !== CONTRACT_STATUS.SIGNING) {
      return res
        .status(200)
        .json(
          generateResponse(
            405,
            {},
            `Contract with id=${id} is not in signing status`,
            {}
          )
        );
    }

    const contractParticipant = await findContractParticipantByContractId(id);

    if (!contractParticipant) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No participants found for contract with id=${id}`,
            {}
          )
        );
    }

    const contractProcess = await findContractProcessByParticipantId(
      contractParticipant.id
    );

    if (!contractProcess) {
      return res
        .status(200)
        .json(
          generateResponse(
            404,
            {},
            `No contract process found for participant with id=${contractParticipant.id}`,
            {}
          )
        );
    }

    contractProcess.actionStatus = CONTRACT_PROCESS_ACTION_STATUS.SIGNED;
    await contractProcess.save();

    contractParticipant.status = CONTRACT_PARTICIPANT_STATUS.SIGNED;
    contractParticipant.signatureUrl = signatureUrl;
    await contractParticipant.save();

    const participants = await ContractParticipant.findAll({
      where: { contractId: id }, 
      attributes: ['userId'] 
    });

    const userIds = participants.map(participant => participant.userId);

    const users = await User.findAll({
      where: { id: userIds }
    });

    for (const user of users) {
      const emailOptions = {
        to: user.email,
        subject: "THÔNG BÁO XÁC NHẬN HỢP ĐỒNG ĐIỆN TỬ",
        html: `<p>Kính gửi ông/bà : <b></b><br>
               <p> Chúng tôi đã xuất hợp đồng điện tử cho Quý khách hàng. Thông tin hợp đồng đã được lưu trên website:</p>
               <p>Nhằm tạo điều kiện thuận lợi cho Quý khách hàng tra cứu, xem hợp đồng điện tử.</p>
               <p>Chúng tôi xin gửi tới khách hàng hướng dẫn như sau:</p>
               <p>Bước 1: Vào website: http://localhost:4380/contract <br>
               Bước 2: Đăng nhập vào website: http://localhost:4380/contract <br>
               Bước 3: Chọn mục quản lý hợp đồng <br>
               Bước 4: Thực hiện hành động ký, duyệt</p>
               <p>Chúng tôi xin trân trọng cảm ơn Quý khách hàng đã tin tưởng sử dụng và hợp tác với giải pháp hợp đồng điện tử.<br>
               Mọi vướng mắc về phần mềm vui lòng liên hệ theo số 091111111 hoặc website: http://localhost:4380/contract để được giải quyết nhanh nhất !!</p>`
      };

      await sendEmail(emailOptions);
    }

    return res
      .status(200)
      .json(
        generateResponse(
          200,
          {},
          `The signing action for the contract with id=${id} was performed successfully`,
          {}
        )
      );
  } catch (error) {
    logger.error('Error signing contract:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};

module.exports.downloadFile = async (req, res) => {
  try {
    const { id, mark } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid ID', {}));
    }

    let filePath;
    let fileName;

    if (mark === CONTRACT_FILE_TYPE.ATTACH_FILE) {
      const attachFile = await ContractAttachFile.findOne({
        where: { id }
      });

      if (!attachFile) {
        return res
          .status(404)
          .json(
            generateResponse(404, {}, `Attach file with id=${id} not found`, {})
          );
      }
      fileName = path.basename(attachFile.dataValues.file);
      filePath = path.resolve("uploads/contracts", attachFile.dataValues.file);
    } else if (mark === CONTRACT_FILE_TYPE.SUB_FILE) {
      const subFile = await ContractSubFile.findOne({
        where: { id }
      });

      if (!subFile) {
        return res
          .status(404)
          .json(
            generateResponse(404, {}, `Subfile with id=${id} not found`, {})
          );
      }
      fileName = path.basename(subFile.dataValues.filepath);
      filePath = path.resolve("uploads/contracts", subFile.dataValues.filepath);
    } else {
      return res
        .status(400)
        .json(
          generateResponse(
            400,
            null,
            'Invalid mark. Must be "attachFile" or "subFile"',
            {}
          )
        );
    }

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json(
          generateResponse(
            404,
            {},
            `File not found on server with id=${id}`,
            {}
          )
        );
    }

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    logger.error('Error downloading file:', error);
    return res
      .status(500)
      .json(generateResponse(500, {}, error.message, error));
  }
};
module.exports.showFileContent = async (req, res) => {
  try {
    const { id, filename } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await Contract.findOne({
      where: { id }
    });

    if (!contract) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    const attachFile = await ContractAttachFile.findOne({
      where: { contractId: id }
    });

    const subFile = await ContractSubFile.findAll({
      where: { contractId: id, file: filename }
    });

    if (!attachFile && !subFile) {
      return res
        .status(404)
        .json(generateResponse(404, {}, `File not found`, {}));
    }

    return res.status(200).sendFile(path.join(baseContractPath, filename));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.showFileContentInSignature = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid contract ID', {}));
    }

    const contract = await Contract.findOne({
      where: { id }
    });

    if (!contract) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Contract with id=${id} not found`, {})
        );
    }

    const attachFile = await ContractAttachFile.findOne({
      where: { contractId: id, file: filename }
    });

    const subFile = await ContractSubFile.findAll({
      where: { contractId: id, file: filename }
    });

    if (!attachFile && !subFile) {
      return res
        .status(404)
        .json(generateResponse(404, {}, `File not found`, {}));
    }

    return res.status(200).sendFile(path.join(baseContractPath, filename));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

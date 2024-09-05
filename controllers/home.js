const { logger } = require('../config/logger');
const packageJson = require('../package.json');
const {
  Contract,
  ContractType,
  ContractParticipant
} = require('../models');
const { col, literal } = require('sequelize');
module.exports.home = async function (req, res) {
  logger.info('Calling /api/');
  try {
    // Đếm số lượng contracts trong bảng Contract
    const contractsTotal = await Contract.findAll();
    const contractCount = contractsTotal.length;
    const contractsSigningTotal = await Contract.findAll({
      where: {
        status: 2
      }
    });
    const contractSigningCount = contractsSigningTotal.length;
    const contractsSignedTotal = await Contract.findAll({
      where: {
        status: 3
      }
    });
    const contractSignedCount = contractsSignedTotal.length;
    const contractsCancelTotal = await Contract.findAll({
      where: {
        status: 4
      }
    });
    const contractCancelCount = contractsCancelTotal.length;
    const typeContractCount = await ContractParticipant.findAll({
      include: [
        {
          model: Contract,
          as: 'contractParticipants',
          attributes: []
        },
        {
          model: ContractType,
          attributes: []
        }
      ],
      attributes: [
        [col('ContractType.name'), 'name'],
        [literal('ROUND(COUNT(ContractParticipant.contractId) / 2, 0)'), 'contractCount']
      ],
      group: ['ContractType.id'],
      raw: true,
    });
    // Trả về phản hồi với mã trạng thái 200 (OK) và một đối tượng JSON chứa thông tin phiên bản, tên và số lượng contracts
    return res.status(200).json({
      version: packageJson.version,
      name: packageJson.name,
      contractCount: contractCount,
      contractSigningCount: contractSigningCount,
      contractSignedCount: contractSignedCount,
      contractCancelCount: contractCancelCount,
      typeContractCount,
    });
  } catch (error) {
    // Ghi log lỗi nếu có
    logger.error('Error fetching contract count:', error);

    // Trả về phản hồi lỗi với mã trạng thái 500 (Internal Server Error)
    return res.status(500).json({
      message: 'An error occurred while fetching the contract count',
      error: error.message
    });
  }
};

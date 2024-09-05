const { Op } = require('sequelize');
const { generateResponse } = require("../config/generateResponse");
const { ContractType, ContractTypeProcessTemplate, ContractParticipant } = require("../models");
const { ContractTypeSchema } = require("../validations/contractTypes");
const { isStrPositiveNum } = require("../utils/numberUtils");

module.exports.getContractTypeList = async (req, res) => {
    try {
        const {
            name,
        } = req.query;

        let filterConditions = {};

        if (name) {
            filterConditions.name = { [Op.like]: `%${name}%` };
        }

        const contractTypes = await ContractType.findAll(
            {
                where: {
                    ...filterConditions
                },
                attributes: ['id', 'name', 'description'],
                include: {
                    model: ContractTypeProcessTemplate,
                    required: true
                }
            }
        );
        return res.send(generateResponse(200, { 'contractTypes': contractTypes }, '', {}));
    } catch (err) {
        console.error(err);
        return res.status(500).send(generateResponse(500, {}, err.message, err));
    }
}
module.exports.getContractTypeInContractList = async (req, res) => {
    try {
        const contractTypes = await ContractType.findAll({
            attributes: ['id', 'name', 'description'],
            include: {
                model: ContractTypeProcessTemplate,
                attributes: { exclude: ['contractTypeId'] }
            }
        });
        return res.send(generateResponse(200, { contractTypes }, '', {}));
    } catch (err) {
        console.error(err);
        return res.status(500).send(generateResponse(500, {}, err.message, err));
    }
}

module.exports.getContractTypeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isStrPositiveNum(id)) {
            return res.status(400).json(generateResponse(400, null, 'Invalid contract type contract ID', {}));
        }

        const contractTypes = await ContractType.findOne({
            where: { id },
            include: {
                model: ContractTypeProcessTemplate,
                attributes: { exclude: ['contractTypeId'] }
            }
        });

        if (!contractTypes) {
            return res.status(404).send({ error: 'Type contract not found' });
        }

        return res.send(generateResponse(200, contractTypes, '', {}));
    } catch (err) {
        console.error(err);
        return res.status(400).send(generateResponse(500, {}, err.message, {}));
    }
}

module.exports.createContractType = async (req, res) => {
    try {
        const { name, description, contractProcessInput } = req.body;
        const { error, value } = ContractTypeSchema.validate(req.body);
        if (error) {
            return res.status(400).json(generateResponse(400, null,
                error.details[0].message, error.details[0]));
        }


        const contractType = await ContractType.create({
            name,
            description
        });
        const contractTypeCreatedId = contractType.dataValues.id;
        const contractProcessTemplateInsertData = contractProcessInput.map((e) => {
            e.contractTypeId = contractTypeCreatedId;
            return e;
        });
        const contractTypeProcessTemplate = await ContractTypeProcessTemplate.bulkCreate(
            contractProcessTemplateInsertData
        );
        return res.send(generateResponse(200, { contractTypes: contractType, contractTypeProcessTemplate: contractTypeProcessTemplate }, '', {}))
    } catch (err) {
        console.error(err);
        return res.status(400).send(generateResponse(500, {}, err.message, {}));
    }
}
module.exports.updateContractType = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            contractProcessInput
        } = req.body;
        const { error, value } = ContractTypeSchema.validate(req.body);

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
                .json(generateResponse(400, null, 'Invalid contract type ID', {}));
        }

        const contractTypes = await ContractType.findOne({
            where: { id }
        });

        if (!contractTypes) {
            return res
                .status(404)
                .json(
                    generateResponse(404, {}, `Contract type with id=${id} not found`, {})
                );
        }

        await contractTypes.update(
            {
                name,
                description
            }
        );

        await ContractTypeProcessTemplate.destroy({
            where: { contractTypeId: id }
        });
        const contractTypeCreatedId = contractTypes.dataValues.id;
        const contractProcessTemplateInsertData = contractProcessInput.map((e) => {
            e.contractTypeId = contractTypeCreatedId;
            return e;
        });
        await ContractTypeProcessTemplate.bulkCreate(
            contractProcessTemplateInsertData
        );
        return res.json(
            generateResponse(
                200,
                `Contract type with id=${id} is updated`,
                {}
            )
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(generateResponse(500, {}, err.message, err));
    }
};
module.exports.deleteContractType = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isStrPositiveNum(id)) {
            return res
                .status(400)
                .json(generateResponse(400, null, 'Invalid contract type ID', {}));
        }

        const contractTypes = await ContractType.findOne({
            where: { id }
        });

        if (!contractTypes) {
            return res
                .status(404)
                .json(
                    generateResponse(404, {}, `Contract type with id=${id} not found`, {})
                );
        }
        const contractParticipant = await ContractParticipant.findOne({
            where: { contractTypeId: id }
        });

        if (contractParticipant) {
            return res
                .status(400)
                .json(generateResponse(400, {}, `Cannot delete contract type with id=${id} because it is used`, {}));
        }
        await contractTypes.destroy();
        await ContractTypeProcessTemplate.destroy({
            where: { contractTypeId: id }
        });
        return res
            .status(200)
            .json(
                generateResponse(200, {}, `Contract type with id=${id} is deleted`, {})
            );
    } catch (err) {
        console.error(err);
        return res.status(500).json(generateResponse(500, {}, err.message, {}));
    }
};
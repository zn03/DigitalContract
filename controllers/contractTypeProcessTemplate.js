const { generateResponse } = require("../config/generateResponse");
const { ContractTypeProcessTemplate } = require("../models");
const { ContractTypeProcessTemplateSchema } = require("../validations/contractTypeProcessTemplate");
const { isStrPositiveNum } = require("../utils/numberUtils")

module.exports.getContractTypeProcessTemplateList = async (req, res) => {
    try {
        const contractProcessTemp = await ContractTypeProcessTemplate.findAll();
        return res.send(generateResponse(200, { 'ContractTypeProcessTemplate': contractProcessTemp }, '', {}));
    } catch (err) {
        console.error(err);
        return res.status(500).send(generateResponse(500, {}, err.message, err));
    }
}

module.exports.createContractTypeProcessTemplate = async (req, res) => {
    try {
        const { action, step, actionBy, note, contractTypeId } = req.body;
        const { error, value } = ContractTypeProcessTemplateSchema.validate(req.body);
        if (error) {
            return res.status(400).json(generateResponse(400, null,
                error.details[0].message, error.details[0]));
        }
        const contractProcessTemp = await ContractTypeProcessTemplate.create(value);
        return res.send(generateResponse(200, contractProcessTemp, '', {}))
    } catch (err) {
        console.error(err);
        return res.status(400).send(generateResponse(500, {}, err.message, {}));
    }
}
module.exports.updateContractTypeProcessTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, step, actionBy, note, contractTypeId } = req.body;
        const { error, value } = ContractTypeProcessTemplateSchema.validate(req.body);

        if (error) {
            return res.status(400).json(generateResponse(400, null,
                error.details[0].message, error.details[0]));
        }

        if (!isStrPositiveNum(id)) {
            return res.status(400).json(generateResponse(400, null, 'Invalid type contract ID', {}));
        }

        const contractProcessTemp = await ContractTypeProcessTemplate.findOne({
            where: { id }
        });

        if (!contractProcessTemp) {
            return res.status(404).send(generateResponse(404, {}, `Type contract with id=${id} not found`, {}));
        }

        await ContractTypeProcessTemplate.update(value);

        return res.send(generateResponse(200, contractProcessTemp, `Type contract with id=${id} is updated`, {}));
    } catch (err) {
        console.error(err);
        return res.status(500).send(generateResponse(500, {}, err.message, err));
    }

}

module.exports.deleteContractTypeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isStrPositiveNum(id)) {
            return res.status(400).json(generateResponse(400, null, 'Invalid type contract ID', {}));
        };

        const contractTypes = await ContractType.findOne({
            where: { id }
        });

        if (!contractTypes) {
            return res.status(404).send(generateResponse(404, {}, `Type contract with id=${id} not found`, {}));
        };

        await contractTypes.destroy();

        return res.status(200).send(generateResponse(200, {}, `Type contract with id=${id} is deleted`, {}));
    } catch (err) {
        console.error(err);
        return res.status(500).send(generateResponse(500, {}, err.message, {}));
    }

}
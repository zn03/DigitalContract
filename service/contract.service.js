const { Contract, ContractParticipant, ContractProcess } = require('../models');

const findContractById = (id) => {
    return Contract.findOne({ where: { id } })
}

const createContract = (value, userId) => {
    return Contract.create({
        name: value.name,
        description: value.description,
        status: 1,
        contractNumber: value.contractNumber,
        priority: value.priority,
        startDate: value.startDate,
        endDate: value.endDate,
        createBy: userId
    });
}   

const createContractParticipant = (value) => {
    return ContractParticipant.bulkCreate(value);
}

const createContractProcessModel = (value) => {
    return ContractProcess.bulkCreate(value);
}
const findContractParticipantByContractId = (contractId) => {
    return ContractParticipant.findOne({
        where: { contractId },
        attributes: [
            'id', 'contractId', 'userId', 'organizationId', 'contractTypeId', 'processCreatedBy',
            'type', 'step', 'pageSign', 'x', 'y', 'width', 'height', 'createdAt', 'updatedAt', 'status'
        ]
    });
};

const findContractProcessByParticipantId = (id) => {
    return ContractProcess.findOne({
        where: { contractParticipantId: id }
    });
};

module.exports = {
    findContractById,
    createContract,
    createContractParticipant,
    createContractProcessModel,
    findContractParticipantByContractId,
    findContractProcessByParticipantId
};
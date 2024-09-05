const { ContractParticipant, User } = require('../models');

const findNextContractParticipantByContractId = (id) => {
    return ContractParticipant.findOne({where: { id }} );
};



module.exports = {
    findNextContractParticipantByContractId,
};
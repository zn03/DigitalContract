const Joi = require("joi");

module.exports.ContractProcessSchema = Joi.object({
    action: Joi.string().max(50).required(),
    actionStatus: Joi.number().required(),
    step: Joi.number().required(),
    actionBy: Joi.number().required(),
    optional: Joi.boolean().required(),
    contractParticipantId: Joi.required(),
});
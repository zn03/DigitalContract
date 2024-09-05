const Joi = require('joi');

module.exports.contractSchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(500).default(null),
    contractNumber: Joi.string().max(255).required(),
    priority: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    contractParticipantInput: Joi.required(),
    contractProcessInput: Joi.required()
});

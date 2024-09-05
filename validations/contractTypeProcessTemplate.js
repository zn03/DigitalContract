const Joi = require("joi");

module.exports.ContractTypeProcessTemplateSchema = Joi.object({
    action: Joi.string().max(50).required(),
    step: Joi.number().required(),
    actionBy: Joi.number().required(),
    note: Joi.string().max(50),
    contractTypeId: Joi.required(),
});
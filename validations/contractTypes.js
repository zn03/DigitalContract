const Joi = require("joi");

module.exports.ContractTypeSchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(500).required(),
    contractProcessInput: Joi.required(),
});

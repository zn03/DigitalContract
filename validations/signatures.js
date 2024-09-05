const Joi = require("joi");

module.exports.signatureSchema = Joi.object({
    serialNumber: Joi.string().max(100).required(),
    issuer: Joi.string().max(100).required(),
    issueDate: Joi.date().required(),
    expireDate: Joi.date().required(),
    description: Joi.string().max(500).required(),
    apiUrl: Joi.string().max(200).required(),
    userId: Joi.number().max(50),
    type: Joi.number().max(50).required(),
});

const Joi = require("joi");

module.exports.organizationSchema = Joi.object({
    name: Joi.string().max(100).regex(/^[a-zA-Z0-9\s,.-]+$/).required(),
    address: Joi.string().min(1).max(300).regex(/^[a-zA-Z0-9\s,.-]+$/).required(),
    bankName: Joi.string().max(100).required(),
    bankNumber: Joi.string().max(50).required(),
    taxCode: Joi.string().max(15).regex(/^[a-zA-Z0-9\s,.-]+$/).required(),
    phone: Joi.string().max(20).regex(/^[a-zA-Z0-9\s,.-]+$/).required(),
    representative: Joi.string().max(50).required(),
    businessLicenseNo: Joi.string().max(50).regex(/^[a-zA-Z0-9\s,.-]+$/).required(),
    registrationDate: Joi.date().required(),
    status: Joi.number().required(),
    type: Joi.number().required(),
});

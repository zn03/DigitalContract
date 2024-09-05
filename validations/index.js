const Joi = require('joi');

module.exports.uuidSchema = Joi.object({
  uuid: Joi.string().guid({ version: 'uuidv4' }).required()
});
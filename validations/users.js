const Joi = require('joi');

module.exports.authSchema = Joi.object({
  email: Joi.string().max(50).email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
  /**
   * Password requirements:
   * Min 6 characters
   * Max 20 characters
   * At least 1 number
   * At least 1 uppercase character
   * At least 1 special character
   */
  password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^])[A-Za-z\\d@$!%*?&#^]{6,20}$')).required().messages({
    'string.pattern.base': 'Password must be 6-20 characters long, contain at least one uppercase letter, one number, and one special character.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.'
  })
});

module.exports.userSchema = Joi.object({
  idNumber: Joi.string().max(15).regex(/^[a-zA-Z0-9]*$/).required(),
  name: Joi.string().max(50).required(),
  phone: Joi.string().max(20).required(),
  address: Joi.string().max(300).required(),
  phone: Joi.string().max(20).required(),
  status: Joi.number().required(),
  accountType: Joi.number().default(0),
  email: Joi.string().max(50).required()
});

module.exports.signUpSchema = this.authSchema.concat(this.userSchema);
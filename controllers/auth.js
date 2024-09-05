require('dotenv').config();
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../config/jwt');
const { User } = require('../models');
const { signUpSchema } = require('../validations/users');
const { generateResponse } = require('../config/generateResponse');
const { getDateTomorrow } = require('../utils/dateUtils');
const { HttpStatusCode } = require('axios');

module.exports.signUp = async (req, res) => {
  try {
    const { error, value } = signUpSchema.validate(req.body);

    if (error)
      return res.json(
        generateResponse(400, null, error.details[0].message, error.details[0])
      );

    if (await User.findOne({ where: { email: value.email } }))
      return res
        .status(400)
        .json(generateResponse(400, null, 'Email already exists', {}));

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: value.password,
      phone: value.phone,
      address: value.address,
      status: value.status,
      idNumber: value.idNumber,
      accountType: value.accountType || 0
    });

    return res.json(generateResponse(HttpStatusCode.Ok, user));
  } catch (err) {
    console.error(err);

    return res.status(500).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.json(generateResponse(400, {}, 'Sai email hoặc password', {}));

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res.json(generateResponse(400, {}, 'Sai email hoặc password', {}));

    const accessToken = await generateAccessToken({
      id: user.id,
      expireAt: getDateTomorrow()
    });

    return res.json(generateResponse(200, { accessToken, user }, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, {}));
  }
};

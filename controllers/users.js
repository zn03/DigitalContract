const { generateResponse } = require('../config/generateResponse');
const { User, Organization } = require('../models');
const { userSchema } = require('../validations/users');
const { isStrPositiveNum } = require('../utils/numberUtils');
const { Op } = require('sequelize');

module.exports.getUserList = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        organizationId: req.user.organizationId
      }
    });
    return res.json(generateResponse(200, { users: user }, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid user ID', {}));
    }

    const user = await User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(generateResponse(200, user, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(200).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { idNumber, email, password, name, address, phone, status } =
      req.body;
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json(
          generateResponse(
            400,
            null,
            error.details[0].message,
            error.details[0]
          )
        );
    }

    const user = await User.create(value);
    return res.json(generateResponse(200, user, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(400).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { idNumber, email, password, name, address, phone, status } =
      req.body;
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res
        .status(200)
        .json(
          generateResponse(
            400,
            null,
            error.details[0].message,
            error.details[0]
          )
        );
    }

    if (!isStrPositiveNum(id)) {
      return res
        .status(200)
        .json(generateResponse(400, null, 'Invalid user ID', {}));
    }

    const user = await User.findOne({
      where: { id }
    });

    if (!user) {
      return res
        .status(200)
        .json(generateResponse(404, {}, `User with id=${id} not found`, {}));
    }

    await user.update(value);

    return res.json(
      generateResponse(200, user, `User with id=${id} is updated`, {})
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.searchUserByIdNumber = async (req, res) => {
  try {
    const { idNumber } = req.query;

    const user = await User.findAll({
      where: {
        idNumber: {
          [Op.like]: `${idNumber}%`
        }
      }
    });

    return res.json(generateResponse(200, user));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

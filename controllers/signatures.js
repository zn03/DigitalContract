const { generateResponse } = require('../config/generateResponse');
const { Signature } = require('../models');
const { signatureSchema } = require('../validations/signatures');
const { isStrPositiveNum } = require('../utils/numberUtils');

module.exports.getSignatureList = async (req, res) => {
  try {
    const signature = await Signature.findAll();
    return res.json(
      generateResponse(200, { signatures: signature }, '', {})
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.createSignature = async (req, res) => {
  try {
    const { serialNumber, issuer, issueDate, expireDate, description, apiUrl, userId, type } = 
      req.body;
    const { error, value } = signatureSchema.validate(req.body);
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

    const signature = await Signature.create(value);
    return res.json(generateResponse(200, signature, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(400).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.getSignatureById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid signature ID', {}));
    }

    const signature = await Signature.findOne({
      where: { id }
    });

    if (!signature) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    return res.json(generateResponse(200, signature, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(400).json(generateResponse(500, {}, err.message, {}));
  }
};
module.exports.updateSignature = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serialNumber,
      issuer,
      issueDate,
      expireDate,
      description,
      apiUrl,
      userId,
      type
    } = req.body;
    const { error, value } = signatureSchema.validate(req.body);

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

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid signature ID', {}));
    }

    const signature = await Signature.findOne({
      where: { id }
    });

    if (!signature) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Signature with id=${id} not found`, {})
        );
    }

    await signature.update(value);

    return res.json(
      generateResponse(
        200,
        signature,
        `Signature with id=${id} is updated`,
        {}
      )
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.getSignatureByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const signature = await Signature.findAll({
      where: {
        userId: userId
      }
    });

    if (!signature || signature.length === 0) {
      return res.status(404).json(generateResponse(404, {}, 'No signatures found for this user', {}));
    }

    return res.json(generateResponse(200, { signatures: signature }, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};
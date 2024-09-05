const { generateResponse } = require('../config/generateResponse');
const { Organization, User } = require('../models');
const { organizationSchema } = require('../validations/organizations');
const { isStrPositiveNum } = require('../utils/numberUtils');
const { Op } = require('sequelize');

module.exports.getOrganizationList = async (req, res) => {
  try {
    const organization = await Organization.findAll();
    return res.json(
      generateResponse(200, { organizations: organization }, '', {})
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};

module.exports.createOrganization = async (req, res) => {
  try {
    const { error, value } = organizationSchema.validate(req.body);
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

    const organization = await Organization.create(value);
    return res.json(generateResponse(200, organization, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(400).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.findOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid organization ID', {}));
    }

    const organization = await Organization.findOne({
      where: { id }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.json(generateResponse(200, organization, '', {}));
  } catch (err) {
    console.error(err);
    return res.status(400).json(generateResponse(500, {}, err.message, {}));
  }
};
module.exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      bankName,
      bankNumber,
      taxCode,
      phone,
      representative,
      businessLicenseNo,
      registrationDate,
      status,
      type
    } = req.body;
    const { error, value } = organizationSchema.validate(req.body);

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
        .json(generateResponse(400, null, 'Invalid organization ID', {}));
    }

    const organization = await Organization.findOne({
      where: { id }
    });

    if (!organization) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Organization with id=${id} not found`, {})
        );
    }

    await organization.update(value);

    return res.json(
      generateResponse(
        200,
        organization,
        `Organization with id=${id} is updated`,
        {}
      )
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, err));
  }
};
module.exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isStrPositiveNum(id)) {
      return res
        .status(400)
        .json(generateResponse(400, null, 'Invalid organization ID', {}));
    }

    const organization = await Organization.findOne({
      where: { id }
    });

    if (!organization) {
      return res
        .status(404)
        .json(
          generateResponse(404, {}, `Organization with id=${id} not found`, {})
        );
    }

    await organization.destroy();

    return res
      .status(200)
      .json(
        generateResponse(200, {}, `Organization with id=${id} is deleted`, {})
      );
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, {}));
  }
};

module.exports.getOrganizationByTaxCode = async (req, res) => {
  try {
    const taxCode = req.query.taxCode;

    const orgs = await Organization.findAll({
      where: {
        taxCode: {
          [Op.like]: `${taxCode}%`
        },
        id: {
            [Op.not]: req.user.organizationId
        }
      },
      include: [
        {
          model: User,
          where: {
            accountType: 0
          },
          limit: 1
        }
      ]
    });

    return res.json(generateResponse(200, orgs, "", {}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(500, {}, err.message, {}));
  }
};

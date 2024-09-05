const { HttpStatusCode } = require('axios');
const { generateResponse } = require('../config/generateResponse');
const { ContractProcess } = require('../models');
const { ContractProcessSchema } = require('../validations/contractProcess');

module.exports.getContractProcessList = async (req, res) => {
  try {
    const contractProcesses = await ContractProcess.findAll();

    return res.send(
      generateResponse(HttpStatusCode.Ok, {
        ContractProcesses: contractProcesses
      })
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send(generateResponse(500, {}, err.message, err));
  }
};

module.exports.createContractProcess = async (req, res) => {
  try {
    const { error, value } = ContractProcessSchema.validate(req.body);

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

    const contractProcesses = await ContractProcess.create(value);

    return res.send(generateResponse(HttpStatusCode.Ok, contractProcesses));
  } catch (err) {
    console.error(err);
    return res.status(400).send(generateResponse(500, {}, err.message, {}));
  }
};

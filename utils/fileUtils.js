const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const multer = require('multer');
const { logger } = require('../config/logger');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const rootDir = path.join(path.dirname(require.main.filename), '..');

function convertXmlToJson(xmlString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      let rootElementName = Object.keys(result)[0];

      let jsonString = result[rootElementName]['_'];
      if (jsonString) {
        let jsonObject = JSON.parse(jsonString);
        resolve(jsonObject);
      } else {
        reject(new Error('Invalid XML format'));
      }
    });
  });
};

const ensureDirExists = async (dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    logger.info(`Directory structure ensured: ${dirPath}`);
  } catch (error) {
    logger.error(`Error creating directory structure: ${error}`);
  }
};

const saveFileToDisk = async (filePath, file) => {
  try {
    console.log (filePath);
    await ensureDirExists(path.dirname(filePath));
    await fs.promises.writeFile(filePath, file.buffer);
    logger.info(`File created: ${filePath}`);
  } catch (error) {
    logger.error(`Error saving file to disk: ${error}`);
  }
};

module.exports = {
  convertXmlToJson,
  saveFileToDisk,
  ensureDirExists,
  rootDir,
  upload
}

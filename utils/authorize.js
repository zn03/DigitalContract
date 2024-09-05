const crypto = require('crypto');
const config = require('../config.json');
'use strict';
module.exports = authorize;

function authorize(req, res, next) {
  console.logheader();
  next();
}

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is 'rsa'
// 2. An object with the properties of the key

const { publicKey2, privateKey2 } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048
});

const isAuth = async function (req, res, next) {
  // #swagger.autoHeaders = false
  /* #swagger.security = [{
            'apiKeyAuth': []
    }] */

  var token = req.headers.authorization;

  try {
    var token = token.split(' ');
    if (token[0] == 'Bearer') {
      let _decrypt = decrypt(token[1]);
      if (req.headers.makhoa != process.env.API_KEY) {
        return res.status(401).json({
          status: 401,
          message: `Client key không đúng.`
        })
      }
      const userData = JSON.parse(_decrypt);
      const ret = await jollibeeGetUserByUsernamePass(userData.TenDangNhap, userData.MatKhau);
      if (ret.rowsAffected == 0 || typeof ret.rowsAffected === 'undefined') {
        return res.status(401).json({
          status: 401,
          message: `Người dùng không tồn tại`
        })
      } else {
        const user = ret.recordset[0];
        req.user = user;
        next();
      }
    }
    else {
      return res.status(401).json('Unauthorize user')
    }
  } catch (e) {
    console.log(e);
    res.status(401).send(e.message)
  }
}

const algorithm = 'aes-256-cbc';

const register = async function (req, res) {
  try {
    const userData = req.body.data;
    const check_existed_users = (await getUserByUsername(userData.TenDangNhap)).recordset;
    if (check_existed_users.length > 0) {
      return res.status(403).json({
        status: 403,
        message: `Tên người dùng đã tồn tại`
      })
    }
    const response = await createUser(userData.MaSoThue, userData.TenDangNhap, userData.MatKhau);
    if (response.recordset.length < 0) {
      return res.status(403).json({
        status: 403,
        message: `Tạo người dùng thất bại`
      })
    }
    delete response.recordset[0].Pass;
    return res.status(200).json({
      TrangThai: 0,
      ThongTin: 'Thành công ' + new Date().toLocaleDateString('en-GB'),
      data: response.recordset[0]
    });
  } catch (e) {
    console.log(e);
    res.status(403).send(e.message);
  }
};

const encrypt = ((plainText) => {
  var keyString = config.AESKey;
  var IV_SIZE = 16;
  //const iv = crypto.randomBytes(IV_SIZE);
  const iv = Buffer.alloc(IV_SIZE);
  const cipher = crypto.createCipheriv(algorithm, keyString, iv);
  let cipherText = cipher.update(Buffer.from(plainText, 'utf8'));
  cipherText = Buffer.concat([cipherText, cipher.final()]);
  const combinedData = Buffer.concat([iv, cipherText]);
  const combinedString = combinedData.toString('base64');
  return combinedString;
});

const decrypt = ((combinedString) => {
  var IV_SIZE = 16;
  var keyString = config.AESKey;
  const combinedData = Buffer.from(combinedString, 'base64');
  const iv = Buffer.alloc(IV_SIZE);
  const cipherText = Buffer.alloc(combinedData.length - iv.length);
  combinedData.copy(iv, 0, 0, iv.length);
  combinedData.copy(cipherText, 0, iv.length);
  const decipher = crypto.createDecipheriv(algorithm, keyString, iv);
  let plainText = decipher.update(cipherText, 'utf8');
  plainText += decipher.final('utf8');
  return plainText;
});

module.exports = {
  register,
  decrypt,
  encrypt,
  isAuth
}
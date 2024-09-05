const jwt = require('jsonwebtoken');
const jwtKey = process.env.API_KEY;

const generateAccessToken = async (data) => {
    let token = await jwt.sign(data, jwtKey);
    return token;
}

const decodeToken = async (token) => {
    const decoded = await jwt.verify(token, jwtKey);
    return decoded;
}
    
module.exports = {
    generateAccessToken,
    decodeToken
};
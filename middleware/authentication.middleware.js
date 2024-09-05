const { decodeToken } = require('../config/jwt');
const createError = require('http-errors');
const { getDateNow } = require('../utils/dateUtils');
const { User } = require('../models');

module.exports.validateAccessToken = async (req, res, next) => {
    try {
        const substring = 'Bearer ';
        const { authorization } = req.headers;

        if (typeof authorization !== 'undefined' && authorization.startsWith(substring)) {
            let token = authorization.replace(substring, '');
            let { id, expireAt } = await decodeToken(token);

            if (getDateNow() > expireAt) {
                return next(createError(401, 'Token expired!'));
            }

            const user = await User.findOne({
                where: { id },
            });

            if (!user) {
                return next(createError(401, 'Invalid account'));
            }

            req.user = user;
            return next();
        } else {
            return next(createError(401, 'Authorization header missing or malformed'));
        }
    } catch (err) {
        console.error(err);
        return next(createError(401, 'Invalid token'));
    }
};

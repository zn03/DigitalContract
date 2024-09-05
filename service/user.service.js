const { User } = require('../models');

const findUserById = (userId) => {
    return User.findOne({ where: { id: userId } });
};

module.exports = {
    findUserById
};
'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Contract, {
        foreignKey: 'createBy',
      });
      User.belongsTo(models.Organization, {
        foreignKey: 'organizationId'
      });
      User.hasMany(models.ContractParticipant, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Signature, {
        foreignKey: 'userId'
      });
    }

    // toJSON() {
    //   return { ...this.get(), id: undefined, password: undefined }
    // }
  }

  User.init({
    idNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      set(value) {
        const passwordHash = bcrypt.hashSync(value, process.env.PASSWORD_SALT);
        this.setDataValue('password', passwordHash);
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    accountType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};
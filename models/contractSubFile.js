'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractSubFile extends Model {
    static associate(models) {
      ContractSubFile.belongsTo(models.Contract, {
        foreignKey: 'contractId'
      })
    }
  }

  ContractSubFile.init({
    contractId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

  }, {
    sequelize,
    tableName: 'contractSubFiles',
    modelName: 'ContractSubFile',
  });

  return ContractSubFile;
};

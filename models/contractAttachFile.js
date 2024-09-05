'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractAttachFile extends Model {
    static associate(models) {
      ContractAttachFile.belongsTo(models.Contract, {
        foreignKey: 'contractId'
      })
    }
  }

  ContractAttachFile.init({
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
    tableName: 'contractAttachFiles',
    modelName: 'ContractAttachFile',
  });

  return ContractAttachFile;
};

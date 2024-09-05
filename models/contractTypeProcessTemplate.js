'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractTypeProcessTemplate extends Model {
    static associate(models) {
      ContractTypeProcessTemplate.belongsTo(models.ContractType, {
        foreignKey: 'contractTypeId'
      });
    }
  }

  ContractTypeProcessTemplate.init({
    action: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    step: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    actionBy: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    note: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    contractTypeId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
  }, {
    sequelize,
    tableName: 'contractTypeProcessTemplates',
    modelName: 'ContractTypeProcessTemplate',
  });

  return ContractTypeProcessTemplate;
};

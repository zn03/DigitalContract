'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractType extends Model {
    static associate(models) {
      ContractType.hasMany(models.ContractTypeProcessTemplate, {
        foreignKey: 'contractTypeId'
      });
      ContractType.hasMany(models.ContractParticipant, {
        foreignKey: 'contractTypeId'
      });
    }
  }

  ContractType.init(
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'contractTypes',
      modelName: 'ContractType'
    }
  );

  return ContractType;
};

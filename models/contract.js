'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.User, {
        foreignKey: 'createBy'
      });
      Contract.hasMany(models.ContractAttachFile, {
        foreignKey: 'contractId',
        onDelete: 'CASCADE'
      });
      Contract.hasMany(models.ContractSubFile, {
        foreignKey: 'contractId',
        onDelete: 'CASCADE'
      });
      Contract.hasMany(models.ContractParticipant, {
        foreignKey: 'contractId',
        as: 'contractParticipants'
      })
    }
  }

  Contract.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contractNumber: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    priority: {
      allowNull: false,
      type: DataTypes.TINYINT
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    tableName: 'contracts',
    modelName: 'Contract',
  });

  return Contract;
};

'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContractParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ContractParticipant.belongsTo(models.Contract, {
        foreignKey: 'contractId',
        as: 'contractParticipants'
      })
      ContractParticipant.belongsTo(models.Organization, {
        foreignKey: 'organizationId'
      })
      ContractParticipant.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      ContractParticipant.belongsTo(models.ContractType, {
        foreignKey: 'contractTypeId'
      });
      ContractParticipant.hasMany(models.ContractProcess, {
        foreignKey: 'contractParticipantId'
      });
    }
  }
  ContractParticipant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contractId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    userId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    organizationId: {
      allowNull: true,
      type: DataTypes.BIGINT
    },
    contractTypeId: {
      allowNull: true,
      type: DataTypes.BIGINT
    },
    processCreatedBy: {
      allowNull: true,
      type: DataTypes.BIGINT,
      comment: "Who created the contract process",
    },
    type: {
      allowNull: false,
      type: DataTypes.TINYINT
    },
    isCreated: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    step: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    pageSign: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    signatureUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'contractParticipants',
    modelName: 'ContractParticipant',
  });
  return ContractParticipant;
};
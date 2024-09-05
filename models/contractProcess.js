'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractProcess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ContractProcess.belongsTo(models.ContractParticipant, {
        foreignKey: 'contractParticipantId'
      })
    }
  }
  ContractProcess.init(
    {
      action: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      actionStatus: {
        allowNull: false,
        type: DataTypes.TINYINT
      },
      step: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      actionBy: {
        allowNull: true,
        type: DataTypes.BIGINT
      },
      contractParticipantId: {
        allowNull: true,
        type: DataTypes.BIGINT
      },
      optional: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'contractProcesses',
      modelName: 'ContractProcess'
    }
  );
  return ContractProcess;
};

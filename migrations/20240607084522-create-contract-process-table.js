'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('contractProcesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      actionStatus: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      step: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      actionBy: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      contractParticipantId: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      optional: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('contractProcesses');
  }
};

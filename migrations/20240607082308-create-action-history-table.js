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
    await queryInterface.createTable('actionHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      actionTo: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      actionToTableName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING(500)
      },
      actionBy: {
        allowNull: false,
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('actionHistories');
  }
};

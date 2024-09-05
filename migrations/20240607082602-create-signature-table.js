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
    await queryInterface.createTable('signatures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      serialNumber: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      issuer: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      issueDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      expireDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      apiUrl: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      userId: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      organizationId: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      type: {
        allowNull: false,
        type: Sequelize.TINYINT
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
    await queryInterface.dropTable('signatures');
  }
};

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
    await queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(300)
      },
      bankName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      bankNumber: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      taxCode: {
        allowNull: false,
        type: Sequelize.STRING(15)
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      representative: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      businessLicenseNo: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      registrationDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      type: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('organizations');
  }
};

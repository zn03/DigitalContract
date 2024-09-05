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
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      bankName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      bankNumber: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      senderName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      validDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expireDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      paymentBundleName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      period: {
        allowNull: false,
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('payments');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('contractParticipants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      contractId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      organizationId: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      contractTypeId: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      processCreatedBy: {
        allowNull: true,
        type: Sequelize.BIGINT,
        comment: 'Who created the contract process'
      },
      type: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      step: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      pageSign: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      x: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      y: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      signatureUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isCreated: {
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('contractParticipants');
  }
};

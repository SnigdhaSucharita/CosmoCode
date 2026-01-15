"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      passwordHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      verificationTokenHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      verificationExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      resetTokenHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      resetExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      failedLoginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      lockUntil: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      tokenVersion: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sessions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      refreshTokenHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
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

    await queryInterface.addIndex("sessions", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("sessions");
  },
};

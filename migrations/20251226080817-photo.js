"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("photos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      altDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      aiCaption: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      embedding: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        allowNull: true,
      },

      colorPalette: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      aiProcessed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      dateSaved: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("photos");
  },
};

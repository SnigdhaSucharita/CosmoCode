"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Photos", "altDescription");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Photos", "altDescription", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

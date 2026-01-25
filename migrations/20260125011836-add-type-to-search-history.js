"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("SearchHistories", "type", {
      type: Sequelize.ENUM("semantic-search", "tag-search"),
      allowNull: false,
      defaultValue: "semantic-search",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("SearchHistories", "type");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_searchHistories_type";',
    );
  },
};

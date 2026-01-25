"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tags", "type", {
      type: Sequelize.ENUM("ai", "custom"),
      allowNull: false,
      defaultValue: "custom",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tags", "type");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tags_type";',
    );
  },
};

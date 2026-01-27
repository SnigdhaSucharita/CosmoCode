"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Photos", ["userId", "imageUrl"], {
      unique: true,
      name: "photos_userid_imageurl_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Photos", "photos_userid_imageurl_unique");
  },
};

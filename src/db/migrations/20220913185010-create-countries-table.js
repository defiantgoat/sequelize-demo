"use strict";

const tableName = "countries";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING(255),
      },
      iso_a2: {
        type: Sequelize.STRING(2),
      },
      iso_a3: {
        type: Sequelize.STRING(3),
      },
      region_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "regions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      region_name: {
        type: Sequelize.STRING(50),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};

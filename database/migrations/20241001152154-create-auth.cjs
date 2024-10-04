'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("auth", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      refreshToken: {
        type: Sequelize.STRING(600),
        allowNull: true,
      },
      refreshTokenExp: {
        type: Sequelize.DATE,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("auth", {
      fields: ["email"],
      unique: true,
      name: "auth_email_unique_index",
    });

    await queryInterface.addIndex("auth", {
      fields: ["id"],
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the indexes and drop the table
    await queryInterface.removeIndex("auth", "auth_email_unique_index");
    await queryInterface.removeIndex("auth", ["id"]);
    await queryInterface.dropTable("auth");
  },
};

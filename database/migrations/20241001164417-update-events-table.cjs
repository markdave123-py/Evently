"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.renameColumn("events", "TotalTickets", "totalTickets");

    await queryInterface.addConstraint("events", {
      fields: ["soldTickets", "totalTickets"],
      type: "check",
      where: {
        soldTickets: {
          [Sequelize.Op.lte]: Sequelize.col("totalTickets"),
        },
      },
      name: "check_sold_tickets_lte_total_tickets",
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.renameColumn("events", "totalTickets", "TotalTickets");

    await queryInterface.removeConstraint(
      "events",
      "check_sold_tickets_lte_total_tickets"
    );
  },
};

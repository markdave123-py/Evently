import { ReservationService } from "../src/reservation/services/reservation.service.js";
import Event from '../src/event/models/event.model.js';
import Reservation from "../src/reservation/models/reservation.js";
import User from "../src/user/models/user.model.js";
import { sequelizeConn } from "../src/core/config/database.js";

describe("ReservationService - createReservation", () => {
  beforeAll(async () => {
    await sequelizeConn.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelizeConn.models.Event.destroy({ truncate: true });
    await sequelizeConn.models.Reservation.destroy({ truncate: true });
    await sequelizeConn.models.User.destroy({ truncate: true });

    await User.create({
      id: "user1",
      email: "user1@example.com",
      password: "password",
    });
    await User.create({
      id: "user2",
      email: "user2@example.com",
      password: "password",
    });
    await User.create({
      id: "user3",
      email: "user3@example.com",
      password: "password",
    });
  });



  it("should create a reservation if tickets are available", async () => {
    const event = await Event.create({
      id: "event1",
      ownerId: "user1",
      name: "Event 1",
      totalTickets: 100,
      soldTickets: 50,
    });

    const reservation = await ReservationService.createReservation(
      "event1",
      "user1"
    );

    expect(reservation.status).toBe("booked");
    const updatedEvent = await Event.findByPk("event1");
    expect(updatedEvent.soldTickets).toBe(51);
  });

  it("should add a user to the waiting list if no tickets are available", async () => {
    const event = await Event.create({
      id: "event2",
      name: "Event 2",
      ownerId: "user2",
      totalTickets: 100,
      soldTickets: 100,
    });

    const reservation = await ReservationService.createReservation(
      "event2",
      "user2"
    );

    expect(reservation.status).toBe("waiting");
  });

  it("should throw an error if the user already has a reservation", async () => {
    const event = await Event.create({
      id: "event3",
      ownerId: "user3",
      name: "Event 3",
      totalTickets: 100,
      soldTickets: 50,
    });

    await ReservationService.createReservation("event3", "user3");


    await expect(
      ReservationService.createReservation("event3", "user3")
    ).rejects.toThrow("You have already reserved a ticket for this event");
  });
});
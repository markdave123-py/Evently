import Event from "../models/event.model.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { UnProcessableError } from "../../core/errors/unProcessableError.js";
import { NotFoundError } from "../../core/errors/notFoundError.js";
import e from "express";

export class EventService {
  static async createEvent(eventData) {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      throw new UnProcessableError(error.message);
    }
  }

  static async getEventById(eventId) {
    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        throw new NotFoundError("Event not found");
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }else {
        throw new UnProcessableError("Failed to fetch event", error.message);
      }
    }
  }

  static async getUserEvents(userId) {
    try {
      const events = await Event.findAll({
        where: {
          userId,
        },
      });
      return events;
    } catch (error) {
      throw new UnProcessableError("Failed to fetch events", error.message);
    }
  }
}

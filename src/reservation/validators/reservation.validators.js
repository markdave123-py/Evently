import Joi from "joi";

export const reservationSchema = Joi.object({
  eventId: Joi.string().uuid().required(),
});

import Joi from 'joi';


export const eventValidator = Joi.object({

    name: Joi.string().min(3).max(255).required(),
    totalTickets: Joi.number().integer().min(1).required(),

})
import Joi from 'joi';

export const signupValidator = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().min(8)
    .max(30)
    .pattern(new RegExp('(?=.*[a-z])'))
    .pattern(new RegExp('(?=.*[A-Z])'))
    .pattern(new RegExp('(?=.*[0-9])'))
    .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])'))
    .required()
    .messages({
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must not exceed 30 characters.',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.empty': 'Password is required.',
    }),
})
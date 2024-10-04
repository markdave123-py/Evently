import { BadRequestError } from "../errors/badRequestError.js";


export const validateSchema =  (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMassage = error.details
        .map((details) => details.message)
        .join(",");

      return next(new BadRequestError(errorMassage));
    }

    next();
  };
};

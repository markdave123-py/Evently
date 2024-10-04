// import * as rateLimit from 'express-rate-limit';

// export const rateLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000,
//     max: 70,
//     message: 'Too many requests from this IP, please try again after 10 minutes',
//     standardHeaders: true,
//     legacyHeaders: false,
// })

import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 70, // Limit each IP to 70 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests",
    message: "You have exceeded the 70 requests in 10 minutes limit!",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

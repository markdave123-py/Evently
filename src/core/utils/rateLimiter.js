import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 70,
  message: {
    status: 429,
    error: "Too many requests",
    message: "You have exceeded the 70 requests in 10 minutes limit!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

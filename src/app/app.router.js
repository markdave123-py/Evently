import { userRouter } from "../user/routes/user.routes.js";
import { authRouter } from "../auth/routes/signIn.js";
import { eventRouter } from "../event/routes/event.routes.js";
import { HttpStatus } from "../core/utils/statuscodes.js";
import { Router } from "express";
import { reservationRouter } from "../reservation/routes/reservation.routes.js";


export const appRouter = Router();


appRouter.use("/user", userRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/event", eventRouter);
appRouter.use("/reservation", reservationRouter);




appRouter.get("/health", (_, res) => {
  res.status(HttpStatus.OK).json({
    message: "API is up and running!",
    version: "1.0",
  });
});

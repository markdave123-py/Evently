import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimiter } from "../core/utils/rateLimiter.js";
import { appRouter } from "./app.router.js";
import { corsOptions } from "../core/config/cors.js";
import { errorHandler } from "../core/middlewares/errorhandler.js";
import { notFoundErrorHandler } from "../core/middlewares/notFoundErrorHandler.js";


export const app = express();



app.use(express.json());

app.use(cookieParser());


app.use(cors(corsOptions));

app.use(rateLimiter);


app.use(express.urlencoded({ extended: false }));

app.use("/api", appRouter);

app.use(notFoundErrorHandler.handle);


app.use(errorHandler.handle);

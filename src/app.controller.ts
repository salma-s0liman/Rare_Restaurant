//Setup ENV
import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: resolve("./config/.env.development") });

//Load express
import type { Express, Request, Response } from "express";
import express from "express";

//Third party middleware
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//import  module routing
import authController from "./modules/auth/auth.controller";
import { globalErrorHandling } from "./commen/utils/response/error.response";
import { AppDataSource } from "./DB/data-source";

//handle base rate limit on all api requests
const limitter = rateLimit({
  windowMs: 60 * 60000,
  limit: 2000,
  message: { error: "Too many request please try again" },
  statusCode: 429,
});

//app-start-point
const bootstrap = (): void => {
  const port: number | String = process.env.PORT || 5000;
  const app: Express = express();

  //global application middleware
  app.use(express.json(), helmet(), cors(), limitter);

  // database connection
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed");
      console.error(error);
    });

  // app-routing
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: `hello to my ${process.env.APPLICATION_NAME}` });
  });

  // sub-app-routing-modules
  app.use("/auth", authController);

  //In-valid routing
  app.use("{/*dumy}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //global-error-handling
  app.use(globalErrorHandling);

  //Start Server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;

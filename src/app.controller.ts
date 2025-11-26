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
import { menuController } from "./modules/menu";
import { globalErrorHandling } from "./common/";
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

  // Health check endpoint
  app.get("/health", async (req: Request, res: Response) => {
    let dbConnected = false;
    let dbError = null;

    try {
      // Check if DataSource is initialized and can execute a simple query
      if (AppDataSource.isInitialized) {
        await AppDataSource.query("SELECT 1");
        dbConnected = true;
      }
    } catch (error) {
      dbError =
        error instanceof Error ? error.message : "Unknown database error";
    }

    const healthStatus = {
      status: dbConnected ? "OK" : "DEGRADED",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      application: {
        name: process.env.APPLICATION_NAME || "Rare Restaurant",
        version: "1.0.0",
        environment: process.env.MODE || "development",
      },
      database: {
        connected: dbConnected,
        initialized: AppDataSource.isInitialized,
        type: "mysql",
        ...(dbError && { error: dbError }),
      },
      server: {
        port: process.env.PORT || 5000,
        memory: {
          used:
            Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
          total:
            Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
        },
      },
    };

    const statusCode = dbConnected ? 200 : 503;
    const message = dbConnected
      ? "Server is healthy"
      : "Server is running but database connection issues detected";

    res.status(statusCode).json({
      success: dbConnected,
      message: message,
      data: healthStatus,
    });
  });

  // sub-app-routing-modules
  app.use("/auth", authController);
  app.use("/api", menuController);

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

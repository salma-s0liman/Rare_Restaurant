// Setup ENV
import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: resolve(".env") }); // load your generated .env

// Load express
import express, { Express, Request, Response, NextFunction } from "express";

// Third-party middleware
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import module routing
import authController from "./modules/auth/auth.controller";
import adminController from "./modules/admin/admin.controller";
import { globalErrorHandling } from "./common/";
import { AppDataSource } from "./DB/data-source";

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Bootstrap function
const bootstrap = async (): Promise<void> => {
  const port: number = Number(process.env.PORT) || 3000;
  const app: Express = express();

  // Global middleware
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(limiter);

  // Test database connection before starting server
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (err: any) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Stop the app if DB fails
  }

  // Base route
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: `Hello from ${process.env.APPLICATION_NAME}` });
  });

  // Module routing
  app.use("/auth", authController);
  app.use("/admin", adminController);

  // Global error handling
  app.use(
    globalErrorHandling as unknown as (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );

  // Start server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;

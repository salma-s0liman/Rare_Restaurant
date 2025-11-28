import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  DB_HOST: process.env.DATABASE_HOST!,
  DB_PORT: Number(process.env.DATABASE_PORT),
  DB_USER: process.env.DATABASE_USERNAME!,
  DB_PASSWORD: process.env.DATABASE_PASSWORD!,
  DB_NAME: process.env.DATABASE_NAME!,
};



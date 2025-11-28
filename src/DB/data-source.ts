import { DataSource } from "typeorm";
import {
  User,
  Address,
  Restaurant,
  Category,
  MenuItem,
  MenuItemImage,
  Cart,
  Order,
  OrderItem,
  RestaurantAdmin,
  OrderStatusHistory,
  Delivery,
  RatingReview,
  ReviewResponse,
  CartItem,
  Token,
} from "./entity/index";
import dotenv from "dotenv";
import { ENV } from "../config/env";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    User,
    Address,
    Restaurant,
    Category,
    MenuItem,
    MenuItemImage,
    Cart,
    Order,
    OrderItem,
    RestaurantAdmin,
    OrderStatusHistory,
    Delivery,
    RatingReview,
    ReviewResponse,
    CartItem,
    Token,
  ],
});



import { DataSource } from "typeorm";
import { Address, Category, MenuItem, Restaurant, User } from "./entity";
import { MenuItemImage } from "./entity/menuItemImage";
import { Cart } from "./entity/cart";
import { Order } from "./entity/order";
import { RestaurantAdmin } from "./entity/restaurantAdmin";
import { OrderItem } from "./entity/orderItem";
import { de } from "zod/v4/locales";
import { DeliveryPerson } from "./entity/deliveryPerson";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST || "",
  port: process.env.DATABASE_PORT as unknown as number,
  username: process.env.DATABASE_USERNAME || "",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "",
  synchronize: true,
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
    DeliveryPerson
    
  ],
});

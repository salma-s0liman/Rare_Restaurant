import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Category } from "./category";
import { v4 as uuidv4 } from "uuid";
import { MenuItem } from "./menuItem";
import { Cart } from "./cart";
import { RestaurantAdmin } from "./restaurantAdmin";
import { Order } from "./order";

@Entity({ name: "restaurants" })
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency?: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean = true;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;
    
    @OneToMany(() => Category, (category) => category.restaurant)
    categories?: Category[];

    @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
    menu_items?: MenuItem[];
     
    @OneToMany(() => Cart, (cart) => cart.restaurant)
    carts?: Cart[];

    @OneToMany(() => RestaurantAdmin, (admin) => admin.restaurant)
    admins?: RestaurantAdmin[];

    @OneToMany(() => Order, (order) => order.restaurant)
    orders?: Order[];
}


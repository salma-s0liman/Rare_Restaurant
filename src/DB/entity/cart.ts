import { User, Restaurant } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "./cartItems";

@Entity({ name: "carts" })
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updated_at?: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.carts, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  @ManyToOne(() => User, (user) => user.carts, {
    nullable: true,
    onDelete: "SET NULL",
  })
  user?: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cart_items?: CartItem[];
}

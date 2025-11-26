import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Cart } from "./cart";
import { MenuItem } from "./menuItem";

@Entity("cart_items")
export class CartItem {

  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart!: Cart;

  @ManyToOne(() => MenuItem, (item) => item.cartItems, { onDelete: "CASCADE" } )
  @JoinColumn({ name: "menu_item_id" })
  menuItem!: MenuItem;

  @Column({ type: "int", default: 1 })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, name: "price_at_add" })
  priceAtAdd!: number;

  @CreateDateColumn({ type: "timestamptz", name: "added_at" })
  addedAt!: Date;
}

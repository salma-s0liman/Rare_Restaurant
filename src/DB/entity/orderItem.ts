import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order, MenuItem } from "./index";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "int", default: 1 })
  quantity!: number;

  @Column({ type: "decimal" })
  price_at_order!: number;

  @Column({ type: "varchar", length: 200 })
  item_name_snapshot?: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order!: Order;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems, {
    nullable: true,
  })
  menu_item?: MenuItem;
}

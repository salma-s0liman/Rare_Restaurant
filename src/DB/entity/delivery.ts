import { Order, User } from "./index";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "deliveries" })
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "timestamp", nullable: true })
  assigned_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  accepted_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at?: Date;

  @ManyToOne(() => Order, (order) => order.delivery, {
    onDelete: "CASCADE",
  })
  order!: Order;

  // Delivery may or may not be assigned to a user
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: "SET NULL",
  })
  deliveryUser?: User;
}

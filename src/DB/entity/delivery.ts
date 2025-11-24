import { Order, User } from "./index";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity({ name: "deliveries" })
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "datetime", nullable: true })
  assigned_at?: Date;

  @Column({ type: "datetime", nullable: true })
  accepted_at?: Date;

  @Column({ type: "datetime", nullable: true })
  completed_at?: Date;

  // ---------------- RELATIONS -----------------

  // Each delivery belongs to one order
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

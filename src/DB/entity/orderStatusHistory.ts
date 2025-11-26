import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Order, User } from "./index";
import { v4 as uuidv4 } from "uuid";
import { orderStatusEnum, userRoleEnum } from "../../common";

@Entity({ name: "order_status_history" })
export class OrderStatusHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({
    type: "enum",
    enum: orderStatusEnum,
    nullable: true,
  })
  previous_status?: orderStatusEnum;

  @Column({
    type: "enum",
    enum: orderStatusEnum,
  })
  new_status!: orderStatusEnum;

  @Column({
    type: "enum",
    enum: userRoleEnum,
    nullable: true,
  })
  actor_type?: userRoleEnum;

  @Column({ type: "text", nullable: true })
  note?: string;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;


  // Many history records belong to one Order
  @ManyToOne(() => Order, (order) => order.statusHistory, {
    onDelete: "CASCADE",
  })
  order!: Order;

  // History entry may or may not be associated with a user
  @ManyToOne(() => User, { nullable: true })
  changedBy?: User;
}

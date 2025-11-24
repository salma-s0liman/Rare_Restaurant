import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

import { Order, User } from "./index";

import { orderStatusEnum, userRoleEnum } from "../../commen";

@Entity({ name: "order_status_history" })
export class OrderStatusHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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

  @Column({ type: "uuid", nullable: true })
  changed_by_user_id?: string;
  // nullable because system actions create logs

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

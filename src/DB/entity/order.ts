// order.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Restaurant } from "./restaurant";
import { Address } from "./address";
import { orderStatusEnum } from "../../commen/enums/order.enum";
import { paymentMethodEnum, paymentStatusEnum } from "../../commen/enums/payment.enum";
import { OrderItem } from "./orderItem";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  order_number!: string; // e.g., REST-20251124-0001

  @Column({
    type: "enum",
    enum: orderStatusEnum,
    default: orderStatusEnum.placed,
  })
  status?: orderStatusEnum;

  @Column({ type: "decimal" })
  subtotal!: number;

  @Column({ type: "decimal", default: 0.0 })
  tax?: number;

  @Column({ type: "decimal", default: 0.0 })
  discount?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  delivery_fee?: number;

  @Column({ type: "decimal" })
  total_amount!: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  placed_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  paid_at?: Date;

  @Column({
    type: "enum",
    enum: paymentStatusEnum,
    default: paymentStatusEnum.pending,
  })
  payment_status?: paymentStatusEnum;

    @Column({
    type: "enum",
    enum: paymentMethodEnum,
    default: paymentMethodEnum.cash,
  })
  payment_method?: paymentMethodEnum;

  @Column({ type: "boolean", default: false })
  is_prepaid!: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  @ManyToOne(() => Address, (address) => address.orders, { nullable: true })
  address?: Address;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items!: OrderItem[];
}

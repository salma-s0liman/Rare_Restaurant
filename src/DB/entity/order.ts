// order.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import {
  User,
  Restaurant,
  Address,
  OrderItem,
  OrderStatusHistory,
  Delivery,
  RatingReview,
} from "./index";

import {
  orderStatusEnum,
  paymentMethodEnum,
  paymentStatusEnum,
} from "../../common";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "varchar", length: 100 })
  order_number!: string;

  @Column({
    type: "enum",
    enum: orderStatusEnum,
    default: orderStatusEnum.placed,
  })
  status!: orderStatusEnum;

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

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  placed_at?: Date;

  @Column({ type: "timestamptz", nullable: true })
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
  items?: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (statusHistory) => statusHistory.order)
  statusHistory?: OrderStatusHistory[];

  @OneToMany(() => Delivery, (delivery) => delivery.order)
  delivery?: Delivery[];

  @OneToMany(() => RatingReview, (ratingReview) => ratingReview.order)
  ratingsReviews?: RatingReview[];
}

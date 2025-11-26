import { User, MenuItem, Order, ReviewResponse } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "ratings_reviews" })
@Unique(["user_id", "menu_item_id", "order_id"])
export class RatingReview {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "uuid" })
  user_id!: string;

  @Column({ type: "uuid" })
  menu_item_id!: string;

  @Column({ type: "uuid" })
  order_id!: string;

  @Column({ type: "int" })
  rating!: number; // 1–5

  @Column({ type: "text", nullable: true })
  review_text?: string;

  @Column({ type: "boolean", default: true })
  is_visible!: boolean;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.ratingsReviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.ratingsReviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "menu_item_id" })
  menuItem!: MenuItem;

  @ManyToOne(() => Order, (order) => order.ratingsReviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @OneToMany(() => ReviewResponse, (response) => response.rating)
  responses!: ReviewResponse[];
}

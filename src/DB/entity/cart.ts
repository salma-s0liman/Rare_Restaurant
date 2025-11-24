import { User, Restaurant } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "carts" })
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
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
}

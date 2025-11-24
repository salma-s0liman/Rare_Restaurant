// restaurantAdmin.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Restaurant } from "./restaurant";
import { User } from "./user";
import { restaurantAdminRoleEnum } from "../../commen/enums/restaurant.enum";

@Entity({ name: "restaurant_admins" })
export class RestaurantAdmin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: restaurantAdminRoleEnum, default: restaurantAdminRoleEnum.owner })
  role?: restaurantAdminRoleEnum;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  // Relation to Restaurant
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.admins, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  // Relation to User
  @ManyToOne(() => User, (user) => user.adminRoles, {
    onDelete: "CASCADE",
  })
  user!: User;
}

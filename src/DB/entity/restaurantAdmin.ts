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
import { v4 as uuidv4 } from "uuid";
import { restaurantAdminRoleEnum } from "../../common/enums/restaurant.enum";

@Entity({ name: "restaurant_admins" })
export class RestaurantAdmin {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "enum", enum: restaurantAdminRoleEnum, default: restaurantAdminRoleEnum.staff })
  role!: restaurantAdminRoleEnum;

  @CreateDateColumn({type: "timestamp", nullable: true})
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

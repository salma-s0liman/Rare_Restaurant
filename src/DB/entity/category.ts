import { Restaurant, MenuItem } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menu_items!: MenuItem[];
}

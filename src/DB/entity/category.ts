import { Restaurant, MenuItem } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menu_items?: MenuItem[];
}

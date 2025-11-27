import { MenuItem } from "./menuItem";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "menu_item_images" })
export class MenuItemImage {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "varchar", length: 1000 })
  url!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  alt_text?: string;

  @Column({ type: "boolean", default: false })
  is_primary: boolean = false;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  created_at?: Date;

  // Relation to MenuItem
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.images, {
    onDelete: "CASCADE",
  })
  menu_item!: MenuItem;
}

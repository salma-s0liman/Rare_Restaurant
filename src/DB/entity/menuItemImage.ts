import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { MenuItem } from "./menuItem";

@Entity({ name: "menu_item_images" })
export class MenuItemImage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 1000 })
  url!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  alt_text?: string;

  @Column({ type: "boolean", default: false })
  is_primary!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  // Relation to MenuItem
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.images, {
    onDelete: "CASCADE",
  })
  menu_item!: MenuItem;
}

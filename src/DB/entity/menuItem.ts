import {
  Restaurant,
  Category,
  MenuItemImage,
  OrderItem,
  RatingReview,
} from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: "menu_items" })
export class MenuItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "boolean", default: true })
  is_available?: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  // Relation to Restaurant
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu_items, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;

  // Relation to Category
  @ManyToOne(() => Category, (category) => category.menu_items, {
    onDelete: "SET NULL",
  })
  category!: Category;

  @OneToMany(() => MenuItemImage, (menuItemImage) => menuItemImage.menu_item)
  images!: MenuItemImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menu_item)
  orderItems!: OrderItem[];

  @OneToMany(() => RatingReview, (ratingReview) => ratingReview.menuItem)
  ratingsReviews!: RatingReview[];
}

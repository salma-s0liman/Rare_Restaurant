import { genderEnum, userRoleEnum } from "../../common";
import {
  Address,
  Cart,
  RestaurantAdmin,
  Order,
  RatingReview,
  ReviewResponse,
} from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string = uuidv4().toString();

  @Column({ type: "varchar", length: 100 })
  firstName!: string;

  @Column({ type: "varchar", length: 100 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column({
    type: "enum",
    enum: genderEnum,
    default: genderEnum.other,
  })
  gender?: genderEnum;

  @Column({
    type: "enum",
    enum: userRoleEnum,
    default: userRoleEnum.customer,
  })
  role?: userRoleEnum;

  @Column()
  password!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  vehicle_info?: string;

  @Column({ type: "boolean", default: true })
  is_active?: boolean;

  // Commented out until database columns are created
  // @Column({ type: "varchar", length: 255, nullable: true, name: "profile_picture" })
  // profilePicture?: string;

  // User preferences - commented out until database columns are created
  // @Column({ type: "varchar", length: 10, default: 'en' })
  // language?: string;

  // @Column({ type: "varchar", length: 10, default: 'USD' })
  // currency?: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts?: Cart[];

  @OneToMany(() => RestaurantAdmin, (admin) => admin.user)
  adminRoles?: RestaurantAdmin[];

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];

  @OneToMany(() => RatingReview, (ratingReview) => ratingReview.user)
  ratingsReviews?: RatingReview[];

  @OneToMany(() => ReviewResponse, (reviewResponse) => reviewResponse.responder)
  reviewResponses?: ReviewResponse[];
}

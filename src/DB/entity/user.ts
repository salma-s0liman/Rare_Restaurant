import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { genderEnum, userRoleEnum } from "../../commen/";
import { Address } from "./address";
import { Cart } from "./cart";
import { RestaurantAdmin } from "./restaurantAdmin";
import { Order } from "./order";
import { DeliveryPerson } from "./deliveryPerson";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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
  lastLoginAt!: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses!: Address[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany(() => RestaurantAdmin, (admin) => admin.user)
  adminRoles!: RestaurantAdmin[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => DeliveryPerson, (deliveryPerson) => deliveryPerson.user)
  deliveryPersons!: DeliveryPerson[];
}

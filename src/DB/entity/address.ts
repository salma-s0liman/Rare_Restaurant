import { User, Order } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: "addresses" })
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  street!: string;

  @Column({ type: "varchar", length: 100 })
  city!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  postal_code?: string;

  @Column({ type: "varchar", length: 100 })
  country!: string;

  @Column({ type: "boolean", default: false })
  is_primary!: boolean;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => Order, (order) => order.address)
  orders!: Order[];
}

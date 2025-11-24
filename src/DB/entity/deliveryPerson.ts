import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "delivery_persons" })
export class DeliveryPerson {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, })
  vehicle_info!: string;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  // Relation: DeliveryPerson belongs to a User
  @ManyToOne(() => User, (user) => user.deliveryPersons, {
    onDelete: "CASCADE",
  })
  user!: User;
}

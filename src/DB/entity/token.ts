import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user";

@Entity({ name: "token" })
export class Token {
  @PrimaryGeneratedColumn("uuid")
  jti: string = uuidv4().toString();

  @Column({ type: "timestamp" })
  expiredAt!: Date;

  @Column({ type: "uuid" })
  createdBy!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "createdBy" })
  user!: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

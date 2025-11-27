import { RatingReview, User } from "./index";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "review_responses" })
export class ReviewResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4().toString();

  @Column({ type: "uuid" })
  rating_id!: string;

  @Column({ type: "uuid" })
  responder_id!: string; // user who replied (restaurant admin)

  @Column({ type: "text" })
  response_text!: string;

  @CreateDateColumn({type: "timestamp", nullable: true})
  created_at?: Date;

  // ------------- Relations --------------

  // Response belongs to a rating/review
  @ManyToOne(() => RatingReview, (rating) => rating.responses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "rating_id" })
  rating!: RatingReview;

  // Response is written by a restaurant admin (User)
  @ManyToOne(() => User, (user) => user.reviewResponses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "responder_id" })
  responder!: User;
}

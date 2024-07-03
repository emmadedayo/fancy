import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { BaseEntity } from "../../../libs/db/BaseEntity";

@Entity('post_paid_views')
export class PostPaidViewEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid' })
  post_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Store amount as a number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_amount: number; // Store initial_amount as a number

  // Define relationships
  @ManyToOne(() => PostEntity, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post?: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

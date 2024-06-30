import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';

@Entity('post_comments')
export class PostCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'post_id', nullable: false })
  post_id: string;

  @ManyToOne(() => PostEntity, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post?: PostEntity;

  @Column({ name: 'user_id', nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}

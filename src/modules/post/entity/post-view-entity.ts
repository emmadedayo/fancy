import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';

export enum PostViewType {
  VIEW = 'view',
  SHARE = 'share',
}

@Entity('post_views')
export class PostViewEntity extends BaseEntity {
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

  @Column({ type: 'enum', enum: PostViewType, nullable: false })
  type: PostViewType;
}

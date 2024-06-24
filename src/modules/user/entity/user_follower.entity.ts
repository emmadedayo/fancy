import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity'; // Adjust the path if needed

@Entity('user_friend')
export class UserFriendEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'follower_id' })
  followerId: string;

  @Column({ name: 'following_id' })
  followingId: string;

  @Column({ name: 'is_accepted', default: false })
  isAccepted?: boolean;

  // Define relationships to the UserEntity
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'follower_id' })
  follower?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'following_id' })
  following?: UserEntity;
}

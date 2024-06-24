import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { StoryEntity } from './story.entity';

@Entity('stories_comment')
export class StoryCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column('uuid')
  story_id: string; // Added story_id column

  @Column('uuid')
  user_id: string; // Added user_id column

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relationship with User entity
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Relationship with Story entity
  @ManyToOne(() => StoryEntity, (story) => story.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { StoryEntity } from './story.entity';

@Entity('story_views')
export class StoryViewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  story_id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => StoryEntity, (story) => story.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

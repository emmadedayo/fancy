import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { StoryViewEntity } from './story-view.entity';

@Entity('stories')
export class StoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  caption: string;

  @Column({ nullable: true })
  hashtags?: string;

  @Column({ nullable: true })
  file_type?: string; // Type of media file (e.g., image, video)

  @Column({ nullable: true })
  file_url?: string;

  @Column({ nullable: true })
  user_id: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relationship with User entity
  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Relationship with StoryView entity
  @OneToMany(() => StoryViewEntity, (storyView) => storyView.story)
  storyViews: StoryViewEntity[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity'; // Adjust the path if your Post entity is elsewhere

@Entity('post_images')
export class PostImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'post_id', nullable: false })
  post_id: string;

  @ManyToOne(() => PostEntity, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post?: PostEntity;

  @Column({ type: 'varchar', nullable: false })
  image: string; // This is typically a file path or URL

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}

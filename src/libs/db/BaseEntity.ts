import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @Exclude()
  @CreateDateColumn()
  created_at?: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at?: Date;
}

import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,

} from 'typeorm';

@Entity()
export class BaseEntity {
  @CreateDateColumn()
  created_at?: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at?: Date;
}

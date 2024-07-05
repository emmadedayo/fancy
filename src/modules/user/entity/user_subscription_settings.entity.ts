import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';

@Entity('user_subscription_settings')
export class UserSubscriptionSettings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  user_id: string;

  @Column()
  bts_price: number;

  @Column()
  call_per_minute_price: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user?: UserEntity;
}

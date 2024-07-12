import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from './user.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';

@Entity('user_subscription_settings')
export class UserSubscriptionSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'user_id' })
  userId?: string;

  @Column()
  bts_price: number;

  @Column()
  call_per_minute_price: number;

  @OneToOne(() => UserEntity, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

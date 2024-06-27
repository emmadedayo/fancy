import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../libs/db/BaseEntity';

@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_name', type: 'varchar', nullable: false })
  subscription_name: string;

  @Column({
    name: 'subscription_description',
    type: 'varchar',
    nullable: false,
  })
  subscription_description: string;

  @Column({
    name: 'subscription_price',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  subscription_price: number;

  @Column({ name: 'subscription_features', type: 'json', nullable: false })
  subscription_features: any;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deleted_at?: Date;
}

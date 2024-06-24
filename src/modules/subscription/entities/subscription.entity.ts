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
  subscriptionName: string;

  @Column({
    name: 'subscription_description',
    type: 'varchar',
    nullable: false,
  })
  subscriptionDescription: string;

  @Column({
    name: 'subscription_price',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  subscriptionPrice: number;

  @Column({ name: 'subscription_features', type: 'json', nullable: false })
  subscriptionFeatures: any;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt?: Date;
}

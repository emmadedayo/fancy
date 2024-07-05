import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { UserEntity } from './user.entity'; // Adjust the path according to your project structure

export enum TransactionType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  CONTENT_PAYMENT = 'CONTENT-PAYMENT',
  TOP_UP = 'TOP-UP',
  OTHERS = 'OTHERS',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export enum Type {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}
@Entity()
export class UserTransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  user_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('varchar')
  reasons: TransactionType;

  @Column('varchar')
  type: Type;

  @Column('varchar')
  description: string;

  @Column('varchar')
  status: TransactionStatus;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user?: UserEntity;
}

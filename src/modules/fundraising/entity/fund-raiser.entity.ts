import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { FundRaisingEntity } from './fundraise.entity';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { UserEntity } from '../../user/entity/user.entity';

export enum FundRaiseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('fund_raisers')
export class FundRaiserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'fund_raising_id', type: 'uuid', nullable: false })
  fundRaisingId: string;

  @ManyToOne(
    () => FundRaisingEntity,
    (fundRaising) => fundRaising.fundRaiserEntity,
  )
  @JoinColumn({ name: 'fund_raising_id', referencedColumnName: 'id' })
  fundRaising: FundRaisingEntity;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number; // Use 'number' for decimals in TypeORM

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column({
    type: 'enum',
    enum: FundRaiseStatus,
    default: FundRaiseStatus.PENDING,
  })
  status: FundRaiseStatus;
}

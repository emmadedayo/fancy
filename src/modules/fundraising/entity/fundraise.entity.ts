import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../libs/db/BaseEntity';
import { UserEntity } from '../../user/entity/user.entity';
import { FundRaiserEntity } from './fund-raiser.entity';

export enum FundRaisingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN-PROGRESS',
  COMPLETED = 'COMPLETED',
  STOP = 'STOP',
}

@Entity('fund_raising')
export class FundRaisingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({ name: 'target_amount', type: 'decimal', precision: 14, scale: 2 })
  target_amount: number; // Use 'number' type for decimals in TypeORM

  @Column({
    type: 'enum',
    enum: FundRaisingStatus,
    default: FundRaisingStatus.PENDING,
  })
  status: FundRaisingStatus;

  @Column({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;

  //expired_at
  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expired_at: Date;

  //slug_url
  @Column({ name: 'slug_url', type: 'varchar', nullable: true })
  slug_url: string;

  //join fund raiser

  @OneToMany(
    () => FundRaiserEntity,
    (fundRaiserEntity) => fundRaiserEntity.fundRaising,
  ) // Corrected relationship
  fundRaiserEntity: FundRaiserEntity[];
}

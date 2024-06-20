import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
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
  targetAmount: number; // Use 'number' type for decimals in TypeORM

  @Column({
    type: 'enum',
    enum: FundRaisingStatus,
    default: FundRaisingStatus.PENDING,
  })
  status: FundRaisingStatus;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  //expired_at
  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt: Date;

  //slug_url
  @Column({ name: 'slug_url', type: 'varchar', length: 255, nullable: true })
  slugUrl: string;

  //join fund raiser

  @OneToMany(
    () => FundRaiserEntity,
    (fundRaiserEntity) => fundRaiserEntity.fundRaising,
  ) // Corrected relationship
  fundRaiserEntity: FundRaiserEntity[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/libs/db/BaseEntity';
import { UserWallet } from './user_wallet.entity';
import { UserSubscriptionSettingEntity } from './user_subscription_settings.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  user_id: string; // Updated to string

  @Column({ type: 'text', nullable: true })
  fcm_token: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ default: 'other' })
  gender: string;

  @Column({
    default:
      'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  })
  avatar: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_creator: boolean;

  @Column({ default: 'pending' })
  creator: string;

  @Column({ type: 'json', nullable: true })
  socials: Record<string, any> | null;

  @Column({ type: 'json', nullable: true })
  user_docs: Record<string, any> | null;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: false })
  is_phone_verified: boolean;

  @Column({ default: true })
  is_available_for_call: boolean;

  @Column({ default: true })
  is_private: boolean;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  phone_verified_at: Date | null;

  @Column({ default: 'pending' })
  account_status: string;

  @Column()
  password: string;

  @Column({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => UserWallet, (wallet) => wallet.user, { eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  wallet: UserWallet;

  //relationship with UserSubscriptionSettings
  @OneToOne(() => UserSubscriptionSettingEntity, (settings) => settings.user, {
    cascade: true,
  })
  settings: UserSubscriptionSettingEntity;

  //
  toJwtPayload() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      user_id: this.user_id,
      is_creator: this.is_creator,
      creator: this.creator,
      account_status: this.account_status,
      wallet: this.wallet,
    };
  }
}

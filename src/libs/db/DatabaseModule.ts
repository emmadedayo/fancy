import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Config } from 'src/config/configuration';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { UnitOfWork } from './UnitOfWork';
import { UNIT_OF_WORK_PROVIDER } from '../constants';
import * as path from 'path';
import { types } from 'pg';
import { UserEntity } from '../../modules/user/entity/user.entity';
import { UserWallet } from '../../modules/user/entity/user_wallet.entity';
import { StoryEntity } from '../../modules/story/entity/story.entity';
import { StoryCommentEntity } from '../../modules/story/entity/story-comment.entity';
import { StoryViewEntity } from '../../modules/story/entity/story-view.entity';
import { SubscriptionEntity } from '../../modules/subscription/entities/subscription.entity';
import { SubscribeUserEntity } from '../../modules/subscription/entities/user_subscription.entity';
import { FundRaiserEntity } from '../../modules/fundraising/entity/fund-raiser.entity';
import { FundRaisingEntity } from '../../modules/fundraising/entity/fundraise.entity';
import { UserFriendEntity } from '../../modules/user/entity/user_follower.entity';
import { PostEntity } from '../../modules/post/entity/post.entity';
import { PostCommentEntity } from '../../modules/post/entity/post-comment-entity';
import { PostImageEntity } from '../../modules/post/entity/post-image-entity';
import { PostLikeEntity } from '../../modules/post/entity/post-like-entity';
import { PostUserTagEntity } from '../../modules/post/entity/post-tags-entity';
import { PostViewEntity } from '../../modules/post/entity/post-view-entity';
import { PostBookmarkEntity } from '../../modules/post/entity/post-bookmark-entity';
import { PostPaidViewEntity } from "../../modules/post/entity/post-paid.entity";

types.setTypeParser(20, 'text', parseInt);
types.setTypeParser(20, BigInt);

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly release: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly dataSource = new DataSource({
    type: 'postgres',
    entities: [
      UserEntity,
      UserWallet,
      StoryEntity,
      StoryCommentEntity,
      StoryViewEntity,
      SubscriptionEntity,
      SubscribeUserEntity,
      FundRaisingEntity,
      FundRaiserEntity,
      UserFriendEntity,
      PostEntity,
      PostCommentEntity,
      PostImageEntity,
      PostLikeEntity,
      PostUserTagEntity,
      PostViewEntity,
      PostBookmarkEntity,
      PostPaidViewEntity,
    ],
    migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
    logging: Config.DATABASE_LOGGING,
    host: Config.DATABASE_HOST,
    port: Config.DATABASE_PORT,
    database: Config.DATABASE_NAME,
    username: Config.DATABASE_USER,
    password: Config.DATABASE_PASSWORD,
    synchronize: false,
    // extra: {
    //   trustServerCertificate: true,
    // },
    ssl: Config.IS_PRODUCTION ? { rejectUnauthorized: false } : null,
  });
  public async checkWriteConnection(): Promise<void> {
    if (this.dataSource.createQueryRunner().isReleased) {
      writeConnection = this.dataSource.createQueryRunner();
    }
  }

  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: UNIT_OF_WORK_PROVIDER,
      useClass: UnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK_PROVIDER],
})
export class DatabaseModule {}

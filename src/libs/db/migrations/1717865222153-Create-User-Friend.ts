import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserFriend1717874759159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    const tableExist = await queryRunner.hasTable('user_friend');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'user_friend',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'follower_id',
              type: 'uuid',
            },
            {
              name: 'following_id',
              type: 'uuid',
            },
            {
              name: 'is_accepted',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
          foreignKeys: [
            {
              name: 'FKFollower',
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              columnNames: ['follower_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            {
              name: 'FKFollowing',
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              columnNames: ['following_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
      );
    } else {
      console.log('Table already exist');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_friend');
  }
}

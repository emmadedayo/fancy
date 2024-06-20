import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostLike1717866098943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('post_likes');
    if (!tableExist) {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
      await queryRunner.createTable(
        new Table({
          name: 'post_likes',
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
              name: 'post_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
          foreignKeys: [
            {
              columnNames: ['post_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'posts',
              onDelete: 'CASCADE',
            },
            {
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'users',
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
    } else {
      console.log('Table post_likes already exists');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('post_likes');
  }
}

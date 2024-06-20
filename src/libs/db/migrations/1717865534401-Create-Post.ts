import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePost1717865534401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('posts');
    if (!tableExist) {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
      await queryRunner.createTable(
        new Table({
          name: 'posts',
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
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'caption',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'hashtags',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'is_free',
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
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'users',
            },
          ],
        }),
      );
    } else {
      console.log('Table already exist');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStories1717874398321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    const tableExist = await queryRunner.hasTable('stories');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'stories',
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
              name: 'caption',
              type: 'varchar',
            },
            //user id
            {
              name: 'user_id',
              type: 'uuid',
            },
            {
              name: 'hashtags',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'file_type',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'file_url',
              type: 'varchar',
              isNullable: true,
            },
            //is deleted
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
              onDelete: 'CASCADE',
            },
          ],
        }),
        true,
      );
    } else {
      console.log('Table already exist');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stories');
  }
}

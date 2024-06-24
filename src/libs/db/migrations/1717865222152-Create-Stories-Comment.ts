import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStoriesComment1717874611448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    const tableExist = await queryRunner.hasTable('stories_comment');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'stories_comment',
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
              name: 'story_id',
              type: 'uuid',
            },
            {
              name: 'user_id',
              type: 'uuid',
            },
            {
              name: 'comment',
              type: 'varchar',
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
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
          foreignKeys: [
            {
              name: 'FK_stories_comment_story_id',
              columnNames: ['story_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'stories',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            {
              name: 'FK_stories_comment_user_id',
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'users',
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
    await queryRunner.dropTable('stories_comment');
  }
}

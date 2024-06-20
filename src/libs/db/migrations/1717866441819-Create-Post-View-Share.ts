import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostViewShare1717866441819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('post_views');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'post_views',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
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
            //type can be view or share enum
            {
              name: 'type',
              type: 'enum',
              enum: ['view', 'share'],
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
              default: 'now()',
            },
          ],
          foreignKeys: [
            {
              columnNames: ['post_id'],
              referencedTableName: 'posts',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
            {
              columnNames: ['user_id'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
    } else {
      console.log('Table post_views already exists');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('post_views');
    if (tableExist) {
      await queryRunner.dropTable('post_views');
    } else {
      console.log('Table post_views does not exist');
    }
  }
}

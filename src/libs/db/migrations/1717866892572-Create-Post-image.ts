import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostImage1717866892572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('post_images');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'post_images',
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
              name: 'image',
              type: 'varchar',
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
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
          foreignKeys: [
            {
              columnNames: ['post_id'],
              referencedTableName: 'posts',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('post_images');
  }
}

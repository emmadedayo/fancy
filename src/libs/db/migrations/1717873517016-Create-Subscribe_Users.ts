import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSubscribeUsers1717873517016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    const tableExist = await queryRunner.hasTable('subscribe_users');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'subscribe_users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'subscription_details',
              type: 'json',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
              default: "'PENDING'",
            },
            {
              name: 'expired_at',
              type: 'timestamp',
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
              name: 'FK_subscribe_users_user_id',
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'users',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscribe_users');
  }
}

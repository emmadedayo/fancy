import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSubscription1717873347386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('subscriptions');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'subscriptions',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'subscription_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'subscription_description',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'subscription_price',
              type: 'decimal',
              precision: 14,
              scale: 2,
              isNullable: false,
            },
            {
              name: 'subscription_features',
              type: 'json',
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
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriptions');
  }
}

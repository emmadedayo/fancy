import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFundRaisers1717873006143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('fund_raisers');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'fund_raisers',
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
              name: 'fund_raising_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'amount',
              type: 'decimal',
              precision: 14,
              scale: 2,
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
              name: 'FKFundRaiserUser',
              columnNames: ['user_id'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            {
              name: 'FKFundRaiserFundRaising',
              columnNames: ['fund_raising_id'],
              referencedTableName: 'fund_raising',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('fund_raisers');
  }
}

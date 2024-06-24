import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFundRaising1717871999731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    const tableExist = await queryRunner.hasTable('fund_raising');
    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'fund_raising',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()', // Ensure uuid-ossp extension is enabled in PostgreSQL
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'target_amount',
              type: 'decimal',
              precision: 14,
              scale: 2,
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['PENDING', 'IN-PROGRESS', 'COMPLETED'],
              default: "'PENDING'", // Single quotes needed for string literals in SQL
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP', // Standard SQL function for current timestamp
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
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
          ],
        }),
        true, // This will create the table if it doesn't exist
      );
    } else {
      console.log('Table fund_raising already exist');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE fund_raisings');
  }
}

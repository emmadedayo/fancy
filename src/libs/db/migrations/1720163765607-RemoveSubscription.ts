import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveSubscription1720163765607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('subscribe_users', 'subscription_details');

    // Add the amount column
    await queryRunner.addColumn(
      'subscribe_users',
      new TableColumn({
        name: 'amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true, // Adjust if this column should be nullable or not
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'subscribe_users',
      new TableColumn({
        name: 'subscription_details',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Drop the amount column
    await queryRunner.dropColumn('subscribe_users', 'amount');
  }
}

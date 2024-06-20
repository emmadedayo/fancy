import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToFundRaiser1718029292033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'fund_raisers',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'PAID', 'REJECTED'],
        default: `'PENDING'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('fund_raisers', 'status');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToFundRaising1718015708252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add images column
    await queryRunner.query(
      `ALTER TABLE fund_raising ADD COLUMN images text[]`,
    );

    await queryRunner.query(
      `ALTER TYPE fund_raising_status_enum ADD VALUE 'STOP'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove images column
    await queryRunner.query(`ALTER TABLE fund_raising DROP COLUMN images`);

    // Remove the 'STOP' value from the enum
    await queryRunner.query(
      `ALTER TYPE fund_raising_status_enum DROP VALUE 'STOP'`,
    );
  }
}

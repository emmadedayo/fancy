import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWalletTable1720159476551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //add column earn_balance to user_wallet and set it to 0 at default
    await queryRunner.query(
      `ALTER TABLE user_wallet ADD COLUMN earn_balance decimal(10,2) DEFAULT 0;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //remove column earn_balance from user_wallet
    await queryRunner.query(
      `ALTER TABLE user_wallet DROP COLUMN earn_balance;`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToFundRaisingMore1718016431349
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //add expired_at column to fund_raising table and slug_url
    await queryRunner.query(
      `ALTER TABLE fund_raising ADD COLUMN expired_at TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE fund_raising ADD COLUMN slug_url VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE fund_raising DROP COLUMN expired_at`);
    await queryRunner.query(`ALTER TABLE fund_raising DROP COLUMN slug_url`);
  }
}

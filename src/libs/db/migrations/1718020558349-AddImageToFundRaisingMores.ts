import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToFundRaisingMores1718020558349
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //change images array from fund_raising table to image
    await queryRunner.query(`ALTER TABLE fund_raising DROP COLUMN images`);
    await queryRunner.query(`ALTER TABLE fund_raising ADD COLUMN image text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE fund_raising DROP COLUMN image`);
    await queryRunner.query(
      `ALTER TABLE fund_raising ADD COLUMN images text[]`,
    );
  }
}

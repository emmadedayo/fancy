import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1719574246304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //add column is_private to users table
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN is_private boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN is_private`);
  }
}

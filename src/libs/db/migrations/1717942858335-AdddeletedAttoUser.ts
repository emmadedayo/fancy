import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdddeletedAttoUser1717942858335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //add deleted_at to user
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //remove deleted_at from user
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePostTable1718139307266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //change hashtags to tips_amount
    await queryRunner.query(
      `ALTER TABLE "posts" RENAME COLUMN "hashtags" TO "tips_amount"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //change tips_amount to hashtags
    await queryRunner.query(
      `ALTER TABLE "posts" RENAME COLUMN "tips_amount" TO "hashtags"`,
    );
  }
}

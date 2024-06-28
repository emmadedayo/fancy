import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1717853159226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable('users');
    if (!tableExist) {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()', // Ensure uuid-ossp extension is enabled in PostgreSQL
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'username',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'phone',
              type: 'varchar', // Assuming phone numbers are stored as strings
              isUnique: true,
            },
            {
              name: 'user_id',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'fcm_token',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'bio',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'gender',
              type: 'varchar',
              default: "'other'", // Quotes around string values
            },
            {
              name: 'avatar',
              type: 'varchar',
              default:
                "'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'",
            },
            {
              name: 'is_active',
              type: 'boolean',
              default: true,
            },
            {
              name: 'is_creator',
              type: 'boolean',
              default: false,
            },
            {
              name: 'creator',
              type: 'varchar',
              default: "'pending'", // Quotes around string values
            },
            {
              name: 'socials',
              type: 'json',
              isNullable: true,
            },
            {
              name: 'user_docs',
              type: 'json',
              isNullable: true,
            },
            {
              name: 'is_email_verified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'is_phone_verified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'is_available_for_call',
              type: 'boolean',
              default: false,
            },
            {
              name: 'email_verified_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'phone_verified_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'account_status',
              type: 'varchar',
              default: "'pending'", // Quotes around string values
            },
            {
              name: 'password',
              type: 'text',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true, // This will create the table if it doesn't exist
      );
    } else {
      console.log('Users table already exist');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

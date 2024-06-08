import { Logger } from "@nestjs/common";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  validateSync,
} from "class-validator";

import { config } from "dotenv";
config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === "true";

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsInt()
  readonly JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === "true";

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  @IsString()
  readonly CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN;

  @IsBoolean()
  readonly IS_PRODUCTION = process.env.IS_PRODUCTION === "true";

  constructor() {
    const error = validateSync(this);

    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();

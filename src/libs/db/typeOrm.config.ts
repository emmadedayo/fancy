import * as typeorm from "typeorm";
import { config } from "dotenv";
import { Config } from "../../config";

config();

console.log("====================================");
console.log(Config.IS_PRODUCTION);
console.log("====================================");

export default new typeorm.DataSource({
  type: "postgres",
  host: Config.DATABASE_HOST,
  port: Config.DATABASE_PORT,
  database: Config.DATABASE_NAME,
  username: Config.DATABASE_USER,
  password: Config.DATABASE_PASSWORD,
  synchronize: Config.DATABASE_SYNC,
  logging: Config.DATABASE_LOGGING,
  // entities: [User, Quizzes, Questions, QuestionOptions], // (from Fisayo) remove this, i just did this to test the migration on dev
  migrations: ["src/libs/db/migrations/*{.ts,.js}"],
  // extra: {
  //   trustServerCertificate: true,
  // },
  ssl: Config.IS_PRODUCTION ? { rejectUnauthorized: false } : null,
});

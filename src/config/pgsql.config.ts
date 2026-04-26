import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const PGTypeORMconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_DB_HOST.toString(),
  port: parseInt(process.env.PG_DB_PORT),

  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,

  synchronize: false,

  migrations: [],
  migrationsRun: false,
  logging: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

  /* Path to load all entity files (.ts or .js) in the src directory and its subdirectories, .ts is used for development and .js is for production, because after build all files will be converted to js */
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
};

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST.toString(),
  port: parseInt(process.env.DB_PORT),

  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,

  synchronize: false, // use true only in development
  logging: true,

  /* Path to load all entity files (.ts or .js) */
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],

  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});

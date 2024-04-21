import * as dotenv from 'dotenv';
dotenv.config();
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import '@mikro-orm/migrations';

const config: Options<PostgreSqlDriver> = {
    dbName: process.env.MIKRO_ORM_DB_NAME,
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    host: process.env.MIKRO_ORM_HOST,
    port: 5432,
    entities: ['./src/entities'],
    entitiesTs: ['./src/entities'],
    migrations: {
        path: './src/migrations',
        pathTs: './src/migrations',
    },
    seeder: {
        pathTs: './src/seeders',
    },
};

export default config;

import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import {join} from "path";

// config for the database from variables environment
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "database",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, "**", "*.entity.{js,ts}")],
    synchronize: false,
};
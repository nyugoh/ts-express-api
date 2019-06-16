import { SyncOptions } from "sequelize";
import { User } from "../src/models";

export const models = [User];

export const syncOptions: SyncOptions = {
  alter: false,
  force: false,
  logging: false
};

export default {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE_PATH,
  port: Number(process.env.DB_PORT)
};

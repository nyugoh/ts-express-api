"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("app/models");
exports.models = [models_1.User];
exports.syncOptions = {
    alter: false,
    force: false,
    logging: false
};
exports.default = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE_PATH,
    port: Number(process.env.DB_PORT)
};

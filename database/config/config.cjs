// import dotenv from 'dotenv';

const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
    migrationStorageTableName: "migrations",
  }
  // test: {
  //   username: user,
  //   password: password,
  //   database: name,
  //   host: host,
  //   dialect: type,
  //   migrationStorageTableName: "migrations_test",
  // },
  // "production": {
  //   "username": "root",
  //   "password": null,
  //   "database": "database_production",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // }
};

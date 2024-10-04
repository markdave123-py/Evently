// import { Sequelize } from "sequelize";
// import { config } from "./env.js";


// const { host, name, password, user } = config.db;


// export const sequelizeConn = new Sequelize(name, user, password, {
//   host: host,
//   dialect: "postgres",
//   logging: false,
//   omitNull: false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });


import { Sequelize } from "sequelize";
import { config } from "./env.js";

let sequelizeConn;

if (process.env.NODE_ENV === 'test') {

  sequelizeConn = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,  
  });
} else {

  const { host, name, password, user } = config.db;

  sequelizeConn = new Sequelize(name, user, password, {
    host: host,
    dialect: "postgres",
    logging: false,
    omitNull: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

export { sequelizeConn };

require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },

  test: {
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASS || 'postgres',
    database: process.env.TEST_DB_NAME || 'picstoria_test',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  }
};

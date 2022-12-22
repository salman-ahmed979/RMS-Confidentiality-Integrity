const mysql = require("mysql2");
const dotenv = require("dotenv")
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = db;

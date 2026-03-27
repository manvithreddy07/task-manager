// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   password: "manvithpostgres",
//   host: "localhost",
//   port: 5432,
//   database: "task_manager"
// });

// module.exports = pool;
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
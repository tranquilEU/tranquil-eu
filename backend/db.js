const { Pool } = require("pg");
const pool = new Pool(); // uses env vars
module.exports = pool;

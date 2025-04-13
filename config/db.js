const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false,
   },
   allowExitOnIdle: true,
});

// Manejar eventos de error en el pool
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL:', err);
  process.exit(-1);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};


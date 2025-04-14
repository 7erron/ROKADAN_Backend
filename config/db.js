const { Pool } = require("pg");
require("dotenv").config();

// Configuración mejorada con manejo explícito
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Asegúrate que coincide con Render
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};

const pool = new Pool(poolConfig);

// Verificación activa de conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión a PostgreSQL exitosa");
    client.release();
  } catch (err) {
    console.error("❌ Error de conexión a PostgreSQL:", err.message);
    process.exit(1); // Detener la app si no hay conexión
  }
};

// Ejecutar inmediatamente
testConnection();

module.exports = pool;
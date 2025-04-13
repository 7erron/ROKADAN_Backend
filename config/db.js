const { Pool } = require('pg');
require('dotenv').config();

// Configuración para desarrollo local vs producción en Render
const isProduction = process.env.NODE_ENV === 'production';

// Conexión para Render (usa DATABASE_URL) o configuración local
const connectionConfig = isProduction
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Requerido por Render PostgreSQL
      }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(connectionConfig);

// Manejar eventos de error en el pool
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL:', err);
  // En producción, considerar reiniciar la aplicación
  if (isProduction) {
    // podriamos agregar notificaciones a Slack/Email si es necesario
  }
  process.exit(-1);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  // Exportar para pruebas si es necesario
  ...(process.env.NODE_ENV === 'test' && { connectionConfig })
};
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool } = require('./config/db');

const app = express();

// Middlewares básicos para desarrollo
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Rutas básicas para desarrollo
app.get('/', (req, res) => {
  res.json({ message: 'API de desarrollo' });
});

// Verificación de conexión a DB
pool.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL conectado'))
  .catch(err => console.error('Error de PostgreSQL:', err));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de desarrollo en http://localhost:${PORT}`);
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { pool } = require('./config/db');

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
  origin: [
    'https://rokadan.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Cabañas Rokadan',
    endpoints: {
      cabanas: '/api/cabanas',
      servicios: '/api/servicios',
      reservas: '/api/reservas'
    }
  });
});

// Rutas API
app.use('/api', routes);

// Manejador de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexión a la base de datos e inicio del servidor
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error de conexión a PostgreSQL:', err);
    process.exit(1);
  }
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- GET /api/cabanas/destacadas');
    console.log('- GET /api/cabanas/disponibles');
    console.log('- GET /api/cabanas/:id');
    console.log('- GET /api/servicios');
  });
});

module.exports = app;
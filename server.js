const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { pool } = require('./config/db');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const corsOptions = {
  origin: [
    'https://rokadan.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://rokadan-backend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Cabañas Rokadan',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/registrar',
        user: 'GET /api/auth/me'
      },
      cabanas: '/api/cabanas',
      servicios: '/api/servicios',
      reservas: '/api/reservas'
    }
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Montar rutas API
app.use('/api', routes);

// Manejador de 404
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Ruta no encontrada',
    availableRoutes: {
      auth: '/api/auth',
      cabanas: '/api/cabanas',
      servicios: '/api/servicios',
      reservas: '/api/reservas'
    }
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conexión a la base de datos e inicio del servidor
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Rutas de autenticación disponibles:');
    console.log('- POST /api/auth/registrar');
    console.log('- POST /api/auth/login');
    console.log('- GET /api/auth/me');
  });
});

module.exports = app;
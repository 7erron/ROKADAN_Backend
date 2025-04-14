require('./config/db');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// Ruta de prueba de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'API de Cabañas funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api', routes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejador de errores
app.use(errorHandler);

module.exports = app;
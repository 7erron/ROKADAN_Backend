const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({
    origin: [
      process.env.CORS_ORIGIN || '*',
      'https://rokadan.netlify.app', 
      'http://localhost:5173'       
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Ruta principal para evitar el error 404
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'ROKADAN API funcionando correctamente',
    status: 'online',
    documentation: '/api/docs'
  });
});

// Rutas API
app.use('/api', routes);

// Manejador de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
});

// Manejador de errores
app.use(errorHandler);

module.exports = app;
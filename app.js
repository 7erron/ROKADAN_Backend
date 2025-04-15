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

// Rutas
app.use('/api', routes);

// Manejador de errores
app.use(errorHandler);

module.exports = app;
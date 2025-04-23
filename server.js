require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { pool } = require('./config/db');

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS
const corsOptions = {
  origin: [
    'https://rokadan.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://rokadan-backend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const cabanasRoutes = require('./routes/cabanasRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/cabanas', cabanasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Cabañas Rokadan',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 10000;
pool.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log('Entorno:', process.env.NODE_ENV || 'development');
    });
  })
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:', err);
    process.exit(1);
  });

module.exports = app;

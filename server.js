const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { pool } = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const cabanasRoutes = require('./routes/cabanasRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');

const app = express();

// Middlewares esenciales
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API de Cabañas Rokadan funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/cabanas', cabanasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Cabañas Rokadan',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cabañas: '/api/cabanas',
      servicios: '/api/servicios',
      reservas: '/api/reservas'
    },
    documentation: 'https://github.com/tu-repo/documentacion'
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    suggestion: 'Verifique la URL o consulte la documentación'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conexión a la base de datos y inicio del servidor
pool.connect()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log('🔹 Entorno:', process.env.NODE_ENV || 'development');
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err);
    process.exit(1);
  });

module.exports = app;
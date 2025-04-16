const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { pool } = require('./config/db');
const routes = require('./routes'); // Importar las rutas

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
        'http://localhost:3000', // Para desarrollo local
        'http://localhost:5173'  // Añadido desde app.js
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Añadido PATCH
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

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

// Rutas API (añadido desde app.js)
app.use('/api', routes);

// Rutas básicas
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Manejador de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 10000; // Utilizar el puerto que proporciona Render o 10000 por defecto

// Probar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err);
    } else {
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0]);
        // Iniciar servidor solo si la conexión a la DB es exitosa
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log('Rutas disponibles:');
            console.log('- GET /api/cabanas/destacadas');
            console.log('- GET /api/cabanas/disponibles');
            console.log('- GET /api/cabanas/:id');
            console.log('- GET /api/servicios');
        });
    }
});

module.exports = app;
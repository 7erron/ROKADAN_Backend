const express = require('express');
const router = express.Router();

// Importación de rutas principales
const authRoutes = require('./authRoutes');
const cabanasRoutes = require('./cabanasRoutes');
const serviciosRoutes = require('./serviciosRoutes');
const reservasRoutes = require('./reservasRoutes');

// Enlazar cada ruta bajo el prefijo /api
router.use('/auth', authRoutes);
router.use('/cabanas', cabanasRoutes);
router.use('/servicios', serviciosRoutes);
router.use('/reservas', reservasRoutes);

module.exports = router;

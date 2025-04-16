const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./authRoutes');
const cabanasRoutes = require('./cabanasRoutes');
const serviciosRoutes = require('./serviciosRoutes');
const reservasRoutes = require('./reservasRoutes');

// Configurar rutas con prefijo /api
router.use('/auth', authRoutes);
router.use('/cabanas', cabanasRoutes);
router.use('/servicios', serviciosRoutes);
router.use('/reservas', reservasRoutes);

module.exports = router;
const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const serviciosController = require('../controllers/serviciosController'); // Asegúrate de tener este controlador
const Cabana = require('../models/Cabana'); // Asegúrate de importar el modelo Cabana
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarReserva, validarId } = require('../middlewares/validators');

// Middleware global de autenticación
router.use(verificarToken);

// Rutas para cabañas
router.route('/cabanas').get(async (req, res) => {
    try {
        const cabanas = await Cabana.findAll(); // Asegúrate de tener este modelo
        res.json(cabanas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al cargar cabañas' });
    }
});

// Rutas para servicios adicionales
router.route('/servicios').get(serviciosController.obtenerServicios); // Uso de getServicios del controlador

// Rutas para reservas
router.route('/')
    .get(reservasController.obtenerReservas)
    .post(validarReserva, reservasController.crearReserva);

router.route('/:id')
    .get(validarId, reservasController.obtenerReserva);

router.route('/:id/cancelar')
    .patch(validarId, reservasController.cancelarReserva);

module.exports = router;

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
        const cabanas = await Cabana.findAll(); // Asegúrate de tener este modelo y que la conexión esté bien
        res.json(cabanas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al cargar cabañas' });
    }
});

// Rutas para servicios adicionales
router.route('/servicios').get(serviciosController.obtenerServicios); // Asegúrate de que el controlador esté correcto

// Rutas para reservas
router.route('/reservas')
    .get(reservasController.obtenerReservas)  // Asegúrate de que esta función esté bien definida en reservasController
    .post(validarReserva, reservasController.crearReserva);  // Crear una reserva, usa el validador de la reserva

router.route('/reservas/:id')
    .get(validarId, reservasController.obtenerReserva)  // Obtener una reserva por ID
    .patch(validarId, reservasController.cancelarReserva);  // Cancelar una reserva

module.exports = router;

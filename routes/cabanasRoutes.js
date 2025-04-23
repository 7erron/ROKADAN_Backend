const express = require('express');
const router = express.Router();
const cabanasController = require('../controllers/cabanasController');
const { auth, restrictToAdmin } = require('../middlewares/auth');
const { validarId } = require('../middlewares/validators');

// Middleware para compatibilidad con frontend legacy
const detectLegacyFrontend = (req, res, next) => {
  req.isLegacyRequest = (
    req.get('Accept') === 'application/json' && 
    !req.get('Content-Type') && 
    !req.query.legacy &&
    !req.headers['x-requested-with']
  );
  next();
};

router.use(detectLegacyFrontend);

// Ruta para obtener cabañas destacadas (pública)
router.get('/destacadas', cabanasController.obtenerCabanasDestacadas);

// Ruta para obtener todas las cabañas (pública)
router.get('/', cabanasController.obtenerCabanas);

// Ruta para obtener cabañas disponibles por fechas (pública)
router.get('/disponibles', cabanasController.obtenerCabanasDisponibles);

// Ruta para obtener una cabaña específica (pública)
router.get('/:id', validarId, cabanasController.obtenerCabana);

// Ruta para crear nueva cabaña (protegida - admin)
router.post('/', 
  auth, 
  restrictToAdmin, 
  cabanasController.crearCabana
);

// Ruta para actualizar cabaña (protegida - admin)
router.patch('/:id', 
  auth, 
  restrictToAdmin, 
  validarId, 
  cabanasController.actualizarCabana
);

// Ruta para eliminar cabaña (protegida - admin)
router.delete('/:id', 
  auth, 
  restrictToAdmin, 
  validarId, 
  cabanasController.eliminarCabana
);

module.exports = router;
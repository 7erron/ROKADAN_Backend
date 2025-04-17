const express = require('express');
const router = express.Router();
const Cabana = require('../models/Cabana');
const { pool } = require('../config/db');
const { auth, restrictToAdmin } = require('../middlewares/auth');
const { validarId } = require('../middlewares/validators');

// Middleware para detectar solicitudes del frontend existente
const detectLegacyFrontend = (req, res, next) => {
  // Detecta si es una solicitud del frontend antiguo
  req.isLegacyRequest = (
    req.get('Accept') === 'application/json' && 
    !req.get('Content-Type') && 
    !req.query.legacy &&
    !req.headers['x-requested-with']
  );
  next();
};

// Aplicar middleware a todas las rutas de cabañas
router.use(detectLegacyFrontend);

// Rutas públicas
router.get('/destacadas', async (req, res) => {
  try {
    const cabanas = await Cabana.findDestacadas();
    
    // Forzar formato legacy para compatibilidad
    if (req.get('origin')?.includes('netlify')) {
      return res.json(cabanas); // Envía array directo a Netlify
    }
    
    // Formato normal para otros clientes
    res.json({
      success: true,
      count: cabanas.length,
      data: cabanas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json([]); // Devuelve array vacío en error
  }
});

router.get('/', async (req, res) => {
  try {
    const cabanas = await Cabana.findAll();
    res.json(req.isLegacyRequest ? cabanas : {
      success: true,
      count: cabanas.length,
      data: cabanas
    });
  } catch (error) {
    console.error('Error al obtener cabañas:', error);
    res.status(500).json(req.isLegacyRequest ? 
      [] : 
      { success: false, message: 'Error al obtener las cabañas' }
    );
  }
});

router.get('/:id', validarId, async (req, res) => {
  try {
    const cabana = await Cabana.findById(req.params.id);
    
    if (!cabana) {
      return res.status(404).json(req.isLegacyRequest ? 
        null : 
        { success: false, message: 'No se encontró la cabaña' }
      );
    }

    res.json(req.isLegacyRequest ? cabana : {
      success: true,
      data: cabana
    });
  } catch (error) {
    console.error(`Error al obtener cabaña ${req.params.id}:`, error);
    res.status(500).json(req.isLegacyRequest ? 
      null : 
      { success: false, message: 'Error al obtener la cabaña' }
    );
  }
});

// Rutas protegidas (solo admin) - Mantienen formato nuevo
router.post('/', auth, restrictToAdmin, async (req, res) => {
  try {
    const nuevaCabana = await Cabana.create(req.body);
    res.status(201).json({
      success: true,
      data: nuevaCabana
    });
  } catch (error) {
    console.error('Error al crear cabaña:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear la cabaña'
    });
  }
});

router.patch('/:id', auth, restrictToAdmin, validarId, async (req, res) => {
  try {
    const cabana = await Cabana.update(req.params.id, req.body);
    res.json({
      success: true,
      data: cabana
    });
  } catch (error) {
    console.error(`Error al actualizar cabaña ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la cabaña'
    });
  }
});

router.delete('/:id', auth, restrictToAdmin, validarId, async (req, res) => {
  try {
    await Cabana.delete(req.params.id);
    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    console.error(`Error al eliminar cabaña ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la cabaña'
    });
  }
});

module.exports = router;
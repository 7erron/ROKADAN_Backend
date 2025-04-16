const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');
const Cabana = require('../models/Cabana');
const { auth, restrictToAdmin } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas públicas
router.get('/destacadas', async (req, res) => {
  try {
    console.log('Solicitud recibida para /api/cabanas/destacadas');
    const cabanas = await Cabana.findDestacadas();
    
    // Versión moderna (con metadata)
    const response = {
      success: true,
      count: cabanas.length,
      data: cabanas
    };
    
    // ENVIAR AMBOS FORMATOS (compatibilidad)
    if (req.query.legacy === 'true') {
      return res.json(cabanas); // Formato antiguo
    } else {
      return res.json(response); // Formato nuevo
    }
    
  } catch (error) {
    console.error('Error en /api/cabanas/destacadas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener cabañas destacadas' 
    });
  }
});
router.get('/', async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.status(200).json({
      status: 'success',
      results: servicios.length,
      data: {
        servicios
      }
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los servicios.'
    });
  }
});

router.get('/:id', validarId, async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el servicio con ese ID.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        servicio
      }
    });
  } catch (error) {
    console.error('Error al obtener servicio por ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el servicio.'
    });
  }
});

// Rutas protegidas (solo admin)
router.post('/', auth, restrictToAdmin, validarServicio, async (req, res) => {
  try {
    const nuevoServicio = await Servicio.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        servicio: nuevoServicio
      }
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error al crear el servicio.'
    });
  }
});

router.patch('/:id', auth, restrictToAdmin, validarId, validarServicio, async (req, res) => {
  try {
    const servicio = await Servicio.update(req.params.id, req.body);
    if (!servicio) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el servicio con ese ID.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        servicio
      }
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el servicio.'
    });
  }
});

router.delete('/:id', auth, restrictToAdmin, validarId, async (req, res) => {
  try {
    const servicio = await Servicio.delete(req.params.id);
    if (!servicio) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el servicio con ese ID.'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el servicio.'
    });
  }
});

module.exports = router;
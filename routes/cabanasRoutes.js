const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');
const Cabana = require('../models/Cabana');
const { pool } = require('../config/db'); // Importamos el pool para testing
const { auth, restrictToAdmin } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas públicas
router.get('/destacadas', async (req, res) => {
  try {
    console.log('Solicitud recibida para /api/cabanas/destacadas');
    
    // Verificamos la conexión a la base de datos primero
    console.log('Probando conexión a la base de datos...');
    const testQuery = await pool.query('SELECT NOW()');
    console.log('Test de conexión a DB exitoso:', testQuery.rows[0]);
    
    // Verificamos que el modelo Cabana existe y tiene el método requerido
    console.log('Verificando modelo Cabana:', typeof Cabana);
    console.log('Método findDestacadas existe:', typeof Cabana.findDestacadas);
    
    // Intentamos ejecutar la consulta
    console.log('Intentando ejecutar Cabana.findDestacadas()');
    const cabanas = await Cabana.findDestacadas();
    console.log('Resultado de cabanas destacadas:', JSON.stringify(cabanas));
    
    if (!cabanas || cabanas.length === 0) {
      console.log('No se encontraron cabañas destacadas');
      return res.status(404).json({ 
        message: 'No se encontraron cabañas destacadas',
        success: false
      });
    }
    
    console.log('Enviando respuesta con cabañas destacadas');
    res.json({
      success: true,
      count: cabanas.length,
      data: cabanas
    });
    
  } catch (error) {
    console.error('Error detallado en /api/cabanas/destacadas:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener cabañas destacadas',
      message: error.message || 'Error desconocido'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Solicitud recibida para /api/cabanas');
    const cabanas = await Cabana.findAll();
    console.log(`Se encontraron ${cabanas.length} cabañas`);
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: {
        cabanas
      }
    });
  } catch (error) {
    console.error('Error al obtener cabañas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las cabañas.'
    });
  }
});

router.get('/:id', validarId, async (req, res) => {
  try {
    console.log(`Solicitud recibida para /api/cabanas/${req.params.id}`);
    const cabana = await Cabana.findById(req.params.id);
    
    if (!cabana) {
      console.log(`No se encontró cabaña con ID ${req.params.id}`);
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
    
    console.log('Enviando datos de cabaña encontrada');
    res.status(200).json({
      status: 'success',
      data: {
        cabana
      }
    });
  } catch (error) {
    console.error(`Error al obtener cabaña con ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la cabaña.'
    });
  }
});

// Rutas protegidas (solo admin)
router.post('/', auth, restrictToAdmin, async (req, res) => {
  try {
    console.log('Solicitud para crear nueva cabaña recibida');
    const nuevaCabana = await Cabana.create(req.body);
    console.log('Cabaña creada:', nuevaCabana);
    
    res.status(201).json({
      status: 'success',
      data: {
        cabana: nuevaCabana
      }
    });
  } catch (error) {
    console.error('Error al crear cabaña:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error al crear la cabaña.'
    });
  }
});

router.patch('/:id', auth, restrictToAdmin, validarId, async (req, res) => {
  try {
    console.log(`Solicitud para actualizar cabaña con ID ${req.params.id}`);
    const cabana = await Cabana.update(req.params.id, req.body);
    
    if (!cabana) {
      console.log(`No se encontró cabaña con ID ${req.params.id} para actualizar`);
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
    
    console.log('Cabaña actualizada correctamente');
    res.status(200).json({
      status: 'success',
      data: {
        cabana
      }
    });
  } catch (error) {
    console.error(`Error al actualizar cabaña con ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la cabaña.'
    });
  }
});

router.delete('/:id', auth, restrictToAdmin, validarId, async (req, res) => {
  try {
    console.log(`Solicitud para eliminar cabaña con ID ${req.params.id}`);
    const cabana = await Cabana.delete(req.params.id);
    
    if (!cabana) {
      console.log(`No se encontró cabaña con ID ${req.params.id} para eliminar`);
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
    
    console.log('Cabaña eliminada correctamente');
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(`Error al eliminar cabaña con ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar la cabaña.'
    });
  }
});

module.exports = router;
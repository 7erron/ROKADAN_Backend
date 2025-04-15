const Cabana = require('../models/Cabaña');
const { validationResult } = require('express-validator');

exports.obtenerCabanas = async (req, res) => {
  try {
    const cabanas = await Cabana.findAll();
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas }
    });
  } catch (error) {
    console.error('Error en obtenerCabanas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las cabañas.'
    });
  }
};

exports.obtenerCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findById(req.params.id);
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        cabana
      }
    });
  } catch (error) {
    console.error('Error en obtenerCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la cabaña.'
    });
  }
};

exports.obtenerCabanasDestacadas = async (req, res) => {
  try {
    const cabanas = await Cabana.findDestacadas();
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: {
        cabanas
      }
    });
  } catch (error) {
    console.error('Error en obtenerCabanasDestacadas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener cabañas destacadas.'
    });
  }
};

exports.obtenerCabanasDisponibles = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fechaInicio, fechaFin, adultos, ninos } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Fechas de inicio y fin son requeridas'
      });
    }

    const cabanas = await Cabana.findDisponibles(
      fechaInicio,
      fechaFin,
      parseInt(adultos || 1),
      parseInt(ninos || 0)
    );
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: {
        cabanas
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al buscar cabañas disponibles.'
    });
  }
};

exports.crearCabana = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuevaCabana = await Cabana.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        cabana: nuevaCabana
      }
    });
  } catch (error) {
    console.error('Error en crearCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la cabaña.'
    });
  }
};

exports.actualizarCabana = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cabana = await Cabana.update(req.params.id, req.body);
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        cabana
      }
    });
  } catch (error) {
    console.error('Error en actualizarCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la cabaña.'
    });
  }
};

exports.eliminarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.delete(req.params.id);
    
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
<<<<<<< HEAD
        message: 'No se encontró la cabaña con ese ID.'
      });
    }
=======
        message: 'No se encontró la cabaña con ese ID'
      });
    }

>>>>>>> 72833abbe9c6336dac1d345f179d9a64e205d330
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error en eliminarCabana:', error);
    res.status(500).json({
      status: 'error',
<<<<<<< HEAD
      message: 'Error al eliminar la cabaña.'
=======
      message: 'Error al eliminar la cabaña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
>>>>>>> 72833abbe9c6336dac1d345f179d9a64e205d330
    });
  }
};
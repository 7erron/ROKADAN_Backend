const Cabana = require('../models/Cabana');
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
      message: 'Error al obtener las cabañas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.obtenerCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findById(req.params.id);
    
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { cabana }
    });
  } catch (error) {
    console.error('Error en obtenerCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la cabaña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.obtenerCabanasDestacadas = async (req, res) => {
  try {
    const cabanas = await Cabana.findDestacadas();
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas }
    });
  } catch (error) {
    console.error('Error en obtenerCabanasDestacadas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener cabañas destacadas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.obtenerCabanasDisponibles = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, adultos = 1, ninos = 0 } = req.query;
    
    // Validaciones básicas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Debe proporcionar ambas fechas (inicio y fin)'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (isNaN(inicio.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Fecha de inicio no válida'
      });
    }

    if (isNaN(fin.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Fecha de fin no válida'
      });
    }

    if (inicio >= fin) {
      return res.status(400).json({
        status: 'fail',
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    const cabanas = await Cabana.findDisponibles(
      fechaInicio,
      fechaFin,
      adultos,
      ninos
    );
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas }
    });
  } catch (error) {
    console.error('Error en obtenerCabanasDisponibles:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error al buscar cabañas disponibles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.crearCabana = async (req, res) => {
  try {
    // Validación de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos de validación inválidos',
        errors: errors.array()
      });
    }

    const nuevaCabana = await Cabana.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { cabana: nuevaCabana }
    });
  } catch (error) {
    console.error('Error en crearCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la cabaña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.actualizarCabana = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos de validación inválidos',
        errors: errors.array()
      });
    }

    const cabana = await Cabana.update(req.params.id, req.body);
    
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { cabana }
    });
  } catch (error) {
    console.error('Error en actualizarCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la cabaña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.eliminarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.delete(req.params.id);
    
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error en eliminarCabana:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar la cabaña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
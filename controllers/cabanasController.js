const Cabana = require('../models/Cabana');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Controlador para obtener todas las cabañas
const obtenerCabanas = async (req, res, next) => {
  try {
    const cabanas = await Cabana.findAll();
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener las cabañas:', error); // Agregado para ver detalles del error
    next(new AppError('Error al obtener las cabañas', 500));
  }
};

// Controlador para obtener una cabaña específica
const obtenerCabana = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Verificar si el ID es válido
    if (isNaN(id)) {
      return next(new AppError('El ID debe ser un número', 400));
    }

    // Intentar obtener la cabaña por el ID
    const cabana = await Cabana.findById(id); 
    
    if (!cabana) {
      return next(new AppError('No se encontró la cabaña con ese ID', 404));
    }

    // Respuesta exitosa
    res.status(200).json({
      status: 'success',
      data: { cabana },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener la cabaña:', error); // Loguear error
    next(new AppError('Error al obtener la cabaña', 500));
  }
};

// Controlador para obtener cabañas destacadas
const obtenerCabanasDestacadas = async (req, res, next) => {
  try {
    const cabanas = await Cabana.findDestacadas();
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener cabañas destacadas:', error); // Loguear error
    next(new AppError('Error al obtener cabañas destacadas', 500));
  }
};

// Controlador para obtener cabañas disponibles
const obtenerCabanasDisponibles = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Datos de entrada inválidos', 400, errors.array()));
    }

    const { fechaInicio, fechaFin, adultos = 1, ninos = 0 } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return next(new AppError('Fechas de inicio y fin son requeridas', 400));
    }

    const cabanas = await Cabana.findDisponibles(
      fechaInicio,
      fechaFin,
      parseInt(adultos),
      parseInt(ninos)
    );
    
    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al buscar cabañas disponibles:', error); // Loguear error
    next(new AppError('Error al buscar cabañas disponibles', 500));
  }
};

// Controlador para crear una nueva cabaña
const crearCabana = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Datos de entrada inválidos', 400, errors.array()));
    }

    const nuevaCabana = await Cabana.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { cabana: nuevaCabana },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear la cabaña:', error); // Loguear error
    next(new AppError('Error al crear la cabaña', 500));
  }
};

// Controlador para actualizar una cabaña
const actualizarCabana = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Datos de entrada inválidos', 400, errors.array()));
    }

    const cabana = await Cabana.update(req.params.id, req.body);
    
    if (!cabana) {
      return next(new AppError('No se encontró la cabaña con ese ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { cabana },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar la cabaña:', error); // Loguear error
    next(new AppError('Error al actualizar la cabaña', 500));
  }
};

// Controlador para eliminar una cabaña
const eliminarCabana = async (req, res, next) => {
  try {
    const cabana = await Cabana.delete(req.params.id);
    
    if (!cabana) {
      return next(new AppError('No se encontró la cabaña con ese ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al eliminar la cabaña:', error); // Loguear error
    next(new AppError('Error al eliminar la cabaña', 500));
  }
};

module.exports = {
  obtenerCabanas,
  obtenerCabana,
  obtenerCabanasDestacadas,
  obtenerCabanasDisponibles,
  crearCabana,
  actualizarCabana,
  eliminarCabana
};

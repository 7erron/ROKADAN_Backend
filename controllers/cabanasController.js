const Cabana = require('../models/Cabana');
const Reserva = require('../models/Reserva');
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al obtener las cabañas', 500));
  }
};

// Controlador para obtener una cabaña específica
const obtenerCabana = async (req, res, next) => {
  try {
    const cabana = await Cabana.findByPk(req.params.id);
    if (!cabana) {
      return next(new AppError('No se encontró la cabaña con ese ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { cabana },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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

    // Lógica para obtener cabañas disponibles según las fechas y número de personas
    const cabanas = await Cabana.findDisponibles(fechaInicio, fechaFin, parseInt(adultos), parseInt(ninos));

    res.status(200).json({
      status: 'success',
      results: cabanas.length,
      data: { cabanas },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al eliminar la cabaña', 500));
  }
};

// Función para realizar una reserva de cabaña
const realizarReserva = async (req, res, next) => {
  try {
    const { cabanaId, usuarioId, fechaInicio, fechaFin, servicios } = req.body;
    
    const cabana = await Cabana.findByPk(cabanaId);
    if (!cabana) {
      return next(new AppError('Cabaña no encontrada', 404));
    }

    const reserva = await Reserva.create({
      cabanaId,
      usuarioId,
      fechaInicio,
      fechaFin,
    });

    // Asociar servicios a la reserva si existen
    if (servicios && servicios.length > 0) {
      // Aquí se supone que tienes una relación de muchos a muchos entre Reserva y Servicio
      await reserva.setServicios(servicios);
    }

    res.status(201).json({
      status: 'success',
      data: { reserva },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al realizar la reserva', 500));
  }
};

module.exports = {
  obtenerCabanas,
  obtenerCabana,
  obtenerCabanasDestacadas,
  obtenerCabanasDisponibles,
  crearCabana,
  actualizarCabana,
  eliminarCabana,
  realizarReserva,
};

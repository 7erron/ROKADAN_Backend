const Reserva = require('../models/Reserva');
const Cabana = require('../models/Cabana');
const Servicio = require('../models/Servicio');
const { validationResult } = require('express-validator');

// Obtener todas las reservas o solo las del usuario autenticado
exports.obtenerReservas = async (req, res) => {
  try {
    let reservas;
    if (req.user.es_admin) {
      reservas = await Reserva.findAll(); // Si usas Sequelize, asegúrate de tener findAll implementado
    } else {
      reservas = await Reserva.findByUserId(req.user.id); // Asegúrate de tener este método en el modelo Reserva
    }

    res.status(200).json({
      status: 'success',
      results: reservas.length,
      data: { reservas }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las reservas.'
    });
  }
};

// Obtener una reserva específica por ID
exports.obtenerReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id); // Asegúrate de tener este método en el modelo Reserva
    if (!reserva) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la reserva con ese ID.'
      });
    }

    if (reserva.usuario_id !== req.user.id && !req.user.es_admin) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para acceder a esta reserva.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { reserva }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la reserva.'
    });
  }
};

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  try {
    // Validación de los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar que la cabaña exista
    const cabana = await Cabana.findById(req.body.cabana_id); // Asegúrate de tener este método en el modelo Cabana
    if (!cabana) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la cabaña con ese ID.'
      });
    }

    // Verificar que los servicios existan
    if (req.body.servicios && req.body.servicios.length > 0) {
      for (const servicioId of req.body.servicios) {
        const servicio = await Servicio.findById(servicioId); // Asegúrate de tener este método en el modelo Servicio
        if (!servicio) {
          return res.status(404).json({
            status: 'fail',
            message: `No se encontró el servicio con ID ${servicioId}.`
          });
        }
      }
    }

    // Calcular el total de la reserva
    const dias = (new Date(req.body.fecha_fin) - new Date(req.body.fecha_inicio)) / (1000 * 60 * 60 * 24);
    if (dias <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'La fecha de inicio debe ser anterior a la fecha de fin.'
      });
    }

    let total = cabana.precio * dias;

    if (req.body.servicios && req.body.servicios.length > 0) {
      for (const servicioId of req.body.servicios) {
        const servicio = await Servicio.findById(servicioId);
        total += servicio.precio * dias;
      }
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      usuario_id: req.user.id,
      cabana_id: req.body.cabana_id,
      fecha_inicio: req.body.fecha_inicio,
      fecha_fin: req.body.fecha_fin,
      adultos: req.body.adultos,
      ninos: req.body.ninos || 0,
      total,
      servicios: req.body.servicios || []
    });

    res.status(201).json({
      status: 'success',
      data: { reserva: nuevaReserva }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la reserva.'
    });
  }
};

// Cancelar una reserva
exports.cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id); // Asegúrate de tener este método en el modelo Reserva
    if (!reserva) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró la reserva con ese ID.'
      });
    }

    if (reserva.usuario_id !== req.user.id && !req.user.es_admin) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para cancelar esta reserva.'
      });
    }

    if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Solo se pueden cancelar reservas pendientes o confirmadas.'
      });
    }

    const reservaCancelada = await Reserva.cancel(req.params.id); // Asegúrate de tener este método en el modelo Reserva
    res.status(200).json({
      status: 'success',
      data: { reserva: reservaCancelada }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cancelar la reserva.'
    });
  }
};

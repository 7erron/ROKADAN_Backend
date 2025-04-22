const Servicio = require('../models/Servicio');
const { validationResult } = require('express-validator');

// Obtener todos los servicios
exports.obtenerServicios = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los servicios.'
    });
  }
};

// Obtener un servicio por ID
exports.obtenerServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id); // Método correcto en Sequelize
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
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el servicio.'
    });
  }
};

// Crear un nuevo servicio
exports.crearServicio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuevoServicio = await Servicio.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        servicio: nuevoServicio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el servicio.'
    });
  }
};

// Actualizar un servicio
exports.actualizarServicio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const servicio = await Servicio.findByPk(req.params.id); // Usar findByPk
    if (!servicio) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el servicio con ese ID.'
      });
    }

    await servicio.update(req.body); // Actualizamos el servicio
    res.status(200).json({
      status: 'success',
      data: {
        servicio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el servicio.'
    });
  }
};

// Eliminar un servicio
exports.eliminarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id); // Usar findByPk
    if (!servicio) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el servicio con ese ID.'
      });
    }

    await servicio.destroy(); // Eliminar servicio
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el servicio.'
    });
  }
};

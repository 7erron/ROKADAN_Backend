const { Servicio } = require('../models/Servicio');
const AppError = require('../utils/appError');

// Obtener todos los servicios
const obtenerServicios = async (req, res, next) => {
  try {
    const servicios = await Servicio.findAll();
    res.status(200).json({
      status: 'success',
      results: servicios.length,
      data: { servicios },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(new AppError('Error al obtener servicios', 500));
  }
};

// Crear un nuevo servicio
const crearServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const nuevoServicio = await Servicio.create({ nombre, descripcion, precio });
    
    res.status(201).json({
      status: 'success',
      data: { servicio: nuevoServicio },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(new AppError('Error al crear servicio', 500));
  }
};

module.exports = {
  obtenerServicios,
  crearServicio,
  obtenerServicio,
  actualizarServicio,
  eliminarServicio
};
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error real al obtener servicios:', error);
    next(new AppError('Error al obtener servicios', 500));
  }
};

// Obtener un servicio por ID
const obtenerServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByID(id);

    if (!servicio) {
      return next(new AppError('Servicio no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { servicio },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al obtener el servicio', 500));
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al crear servicio', 500));
  }
};

// Actualizar un servicio
const actualizarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return next(new AppError('Servicio no encontrado', 404));
    }

    servicio.nombre = nombre ?? servicio.nombre;
    servicio.descripcion = descripcion ?? servicio.descripcion;
    servicio.precio = precio ?? servicio.precio;
    await servicio.save();

    res.status(200).json({
      status: 'success',
      data: { servicio },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al actualizar servicio', 500));
  }
};

// Eliminar un servicio
const eliminarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return next(new AppError('Servicio no encontrado', 404));
    }

    await servicio.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(new AppError('Error al eliminar servicio', 500));
  }
};

module.exports = {
  obtenerServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};

const { verifyToken } = require('../config/jwt');
const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');

const verificarToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('No estás autenticado. Por favor inicia sesión.', 401));
    }

    const decoded = verifyToken(token);
    const currentUser = await Usuario.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('El usuario perteneciente a este token ya no existe.', 401));
    }

    req.user = {
      id: currentUser.id,
      nombre: currentUser.nombre,
      apellido: currentUser.apellido,
      email: currentUser.email,
      es_admin: currentUser.es_admin
    };

    next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado. Por favor inicia sesión nuevamente.', 401));
  }
};

const verificarRol = (rol) => {
  return (req, res, next) => {
    if (rol === 'admin' && !req.user?.es_admin) {
      return next(new AppError('No tienes permiso para realizar esta acción.', 403));
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};

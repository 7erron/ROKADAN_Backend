const { verifyToken } = require('../config/jwt');
const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');

// Middleware para verificar el token
const verificarToken = async (req, res, next) => {
  try {
    // 1) Obtener el token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('No estás autenticado. Por favor inicia sesión.', 401));
    }

    // 2) Verificar token
    const decoded = verifyToken(token);

    // Debug: Verifica la estructura del token decodificado
    console.log('Token decodificado:', decoded);

    // 3) Verificar si el usuario existe
    const currentUser = await Usuario.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('El usuario perteneciente a este token ya no existe.', 401));
    }

    // 4) Adjuntar usuario al request (usando req.usuario para consistencia)
    req.usuario = {
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

// Middleware para verificar si el usuario es administrador
const verificarRol = (rol) => {
  return (req, res, next) => {
    // Verificar si el usuario tiene el rol adecuado
    if (rol === 'admin' && !req.usuario?.es_admin) {
      return next(new AppError('No tienes permiso para realizar esta acción.', 403));
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};

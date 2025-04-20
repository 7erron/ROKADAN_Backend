const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES || 90;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

const generateToken = (user) => {
  try {
    if (!user || !user.id || !user.email) {
      throw new AppError('Datos de usuario incompletos para generar token', 400);
    }

    const payload = {
      id: user.id,
      email: user.email,
      es_admin: user.es_admin || false
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256'
    });
    
  } catch (error) {
    throw new AppError('Error al generar token JWT', 500);
  }
};

const verifyToken = (token) => {
  try {
    if (!token) {
      throw new AppError('Token no proporcionado', 401);
    }

    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token inválido', 401);
    }
    throw new AppError('Error al verificar token', 500);
  }
};

const attachTokenToCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);
};

module.exports = {
  generateToken,
  verifyToken,
  attachTokenToCookie
};
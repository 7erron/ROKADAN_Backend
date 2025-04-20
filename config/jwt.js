const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
require('dotenv').config();

// Configuración de JWT con valores por defecto seguros
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  algorithm: 'HS256',
  cookieExpires: parseInt(process.env.JWT_COOKIE_EXPIRES) || 90
};

// Validación estricta en inicio
if (!JWT_CONFIG.secret) {
  console.error('❌ ERROR FATAL: JWT_SECRET no está configurado');
  console.error('Por favor, define JWT_SECRET en tus variables de entorno');
  process.exit(1); // Termina la aplicación si no hay secret
}

const generateToken = (userPayload) => {
  try {
    // Validación de payload
    if (!userPayload || !userPayload.id || !userPayload.email) {
      throw new AppError('Datos de usuario incompletos para generar token', 400);
    }

    // Payload seguro
    const payload = {
      id: userPayload.id,
      email: userPayload.email,
      es_admin: userPayload.es_admin || false,
      iat: Math.floor(Date.now() / 1000) // Fecha de emisión
    };

    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
      algorithm: JWT_CONFIG.algorithm
    });

  } catch (error) {
    console.error('🔥 Error al generar token:', error);
    throw new AppError('Error al generar el token de autenticación', 500);
  }
};

const verifyToken = (token) => {
  try {
    if (!token) {
      throw new AppError('Token no proporcionado', 401);
    }

    return jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm],
      clockTolerance: 30 // 30 segundos de tolerancia para sincronización de reloj
    });

  } catch (error) {
    // Manejo específico de errores JWT
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Tu sesión ha expirado. Por favor inicia sesión nuevamente', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token de autenticación inválido', 401);
    }
    console.error('🔐 Error al verificar token:', error);
    throw new AppError('Error de autenticación', 500);
  }
};

const attachTokenToResponse = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_CONFIG.cookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined
  };

  res.cookie('jwt_token', token, cookieOptions);
};

const clearTokenFromResponse = (res) => {
  res.clearCookie('jwt_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined
  });
};

module.exports = {
  generateToken,
  verifyToken,
  attachTokenToResponse,
  clearTokenFromResponse,
  JWT_CONFIG // Exportamos la configuración por si se necesita
};
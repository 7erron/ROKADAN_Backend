const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
require('dotenv').config();

// Configuración segura del JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  algorithm: 'HS256',
  cookieExpires: parseInt(process.env.JWT_COOKIE_EXPIRES) || 90
};

// Validación en arranque
if (!JWT_CONFIG.secret) {
  console.error('❌ ERROR FATAL: JWT_SECRET no está configurado');
  process.exit(1);
}

/**
 * Genera un token JWT con los datos esenciales del usuario.
 * @param {Object} userPayload - Información del usuario (debe incluir id, email y es_admin).
 * @returns {string} Token firmado.
 */
const generateToken = (userPayload) => {
  try {
    const { id, email, es_admin } = userPayload;

    if (!id || !email) {
      throw new AppError('Datos de usuario incompletos para generar token', 400);
    }

    const payload = {
      id,
      email,
      es_admin: Boolean(es_admin), // Fuerza a booleano explícitamente
      iat: Math.floor(Date.now() / 1000)
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

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token
 * @returns {Object} Payload decodificado.
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      throw new AppError('Token no proporcionado', 401);
    }

    return jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm],
      clockTolerance: 30
    });

  } catch (error) {
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

/**
 * Adjunta el token JWT a la respuesta como cookie.
 */
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

/**
 * Elimina el token JWT de las cookies de la respuesta.
 */
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
  JWT_CONFIG
};

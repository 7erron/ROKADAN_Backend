const Usuario = require('../models/Usuario');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

exports.registrar = async (req, res) => {
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => err.msg) // Solo enviamos los mensajes
    });
  }

  try {
    const { nombre, apellido, email, telefono, password } = req.body;

    // Verificar usuario existente
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      password
    });

    // Generar token (sin incluir password)
    const userForToken = {
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      es_admin: nuevoUsuario.es_admin || false
    };
    
    const token = generateToken(userForToken);

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        es_admin: nuevoUsuario.es_admin || false
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario'
    });
  }
};

exports.login = async (req, res) => {
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Comparar contraseñas
    const passwordMatch = await Usuario.comparePasswords(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token (sin incluir password)
    const userForToken = {
      id: usuario.id,
      email: usuario.email,
      es_admin: usuario.es_admin || false
    };
    
    const token = generateToken(userForToken);

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        es_admin: usuario.es_admin || false
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al iniciar sesión'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    // Obtener datos actualizados del usuario
    const usuarioActual = await Usuario.findById(req.usuario.id);
    
    if (!usuarioActual) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: usuarioActual.id,
        nombre: usuarioActual.nombre,
        email: usuarioActual.email,
        es_admin: usuarioActual.es_admin || false
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
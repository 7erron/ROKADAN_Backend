const Usuario = require('../models/Usuario');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

exports.registrar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { nombre, apellido, email, telefono, password, confirmPassword } = req.body;

    // Verificar coincidencia de contraseñas
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email.'
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      password
    });

    // Generar token JWT
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario.'
    });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { email, password } = req.body;

    // Verificar usuario y contraseña
    const usuario = await Usuario.findByEmail(email);
    if (!usuario || !(await Usuario.comparePasswords(password, usuario.password))) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos.'
      });
    }

    // Generar token JWT
    const token = generateToken(usuario);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.usuario.id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        es_admin: req.usuario.es_admin
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario.'
    });
  }
};
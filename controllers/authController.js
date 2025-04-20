const Usuario = require('../models/Usuario');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

exports.registrar = async (req, res) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array()); // verificacion
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre, apellido, email, telefono, password } = req.body;
    console.log('Datos recibidos:', { nombre, apellido, email, telefono }); // verificacion

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      console.log('Usuario ya existe:', email); // verificacion
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe un usuario con este email.'
      });
    }

    // Crear nuevo usuario
    console.log('Creando nuevo usuario...'); // verificacion
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      password
    });

    console.log('Usuario creado:', nuevoUsuario); // verificacion

    // Generar token JWT
    const token = generateToken(nuevoUsuario);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          email: nuevoUsuario.email,
          telefono: nuevoUsuario.telefono
        }
      }
    });
  } catch (error) {
    console.error('Error completo en registro:', error); //verificacion
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar el usuario.'
    });
  }
};

exports.login = async (req, res) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // 1) Verificar si el usuario existe y la contraseña es correcta
    const usuario = await Usuario.findByEmail(email);
    if (!usuario || !(await Usuario.comparePasswords(password, usuario.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o contraseña incorrectos.'
      });
    }

    // 2) Generar token JWT
    const token = generateToken(usuario);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          es_admin: usuario.es_admin
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión.'
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // Obtener datos del usuario desde el token (ya verificado por el middleware)
    const usuario = {
      id: req.usuario.id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      es_admin: req.usuario.es_admin
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        usuario
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener información del usuario.'
    });
  }
};
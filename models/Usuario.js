const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

class Usuario {
  static async create({ nombre, apellido, email, telefono, password, es_admin = false }) {
    try {
      // Validación básica de parámetros
      if (!nombre || !apellido || !email || !telefono || !password) {
        throw new AppError('Todos los campos son requeridos', 400);
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const query = `
        INSERT INTO usuarios (nombre, apellido, email, telefono, password, es_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, nombre, apellido, email, telefono, es_admin, creado_en, actualizado_en
      `;
      const values = [nombre, apellido, email, telefono, hashedPassword, es_admin];

      const { rows } = await pool.query(query, values);
      
      if (!rows[0]) {
        throw new AppError('No se pudo crear el usuario', 500);
      }

      return rows[0];
      
    } catch (error) {
      // Manejo específico para errores de duplicado de email
      if (error.code === '23505') {
        throw new AppError('El email ya está registrado', 400);
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      if (!email) {
        throw new AppError('Email es requerido', 400);
      }

      const query = `
        SELECT id, nombre, apellido, email, telefono, password, es_admin 
        FROM usuarios 
        WHERE email = $1
      `;
      const { rows } = await pool.query(query, [email]);
      
      return rows[0] || null;
      
    } catch (error) {
      throw new AppError('Error al buscar usuario por email', 500);
    }
  }

  static async findById(id) {
    try {
      if (!id) {
        throw new AppError('ID de usuario es requerido', 400);
      }

      const query = `
        SELECT id, nombre, apellido, email, telefono, es_admin 
        FROM usuarios 
        WHERE id = $1
      `;
      const { rows } = await pool.query(query, [id]);
      
      if (!rows[0]) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      return rows[0];
      
    } catch (error) {
      throw new AppError('Error al buscar usuario por ID', 500);
    }
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    try {
      if (!candidatePassword || !hashedPassword) {
        throw new AppError('Contraseñas no proporcionadas para comparación', 400);
      }
      
      return await bcrypt.compare(candidatePassword, hashedPassword);
      
    } catch (error) {
      throw new AppError('Error al comparar contraseñas', 500);
    }
  }

  // Método adicional útil
  static async update(id, { nombre, apellido, telefono }) {
    try {
      const query = `
        UPDATE usuarios
        SET nombre = $1, apellido = $2, telefono = $3, actualizado_en = NOW()
        WHERE id = $4
        RETURNING id, nombre, apellido, email, telefono, es_admin
      `;
      const values = [nombre, apellido, telefono, id];
      
      const { rows } = await pool.query(query, values);
      
      if (!rows[0]) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      return rows[0];
      
    } catch (error) {
      throw new AppError('Error al actualizar usuario', 500);
    }
  }
}

module.exports = Usuario;
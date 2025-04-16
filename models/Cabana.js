const { pool } = require('../config/db');

class Cabana {
  static async findAll() {
    const query = 'SELECT * FROM cabanas WHERE disponible = true';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM cabanas WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findDestacadas() {
    const query = `
      SELECT * FROM cabanas 
      WHERE destacada = true AND disponible = true
      ORDER BY creado_en DESC 
      LIMIT 3
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findDisponibles(fechaInicio, fechaFin, adultos, ninos) {
    const query = `
      SELECT c.* 
      FROM cabanas c
      WHERE c.disponible = true
      AND c.capacidad >= $1 + $2
      AND c.id NOT IN (
        SELECT r.cabana_id 
        FROM reservas r
        WHERE r.estado != 'cancelada'
        AND (
          (r.fecha_inicio <= $3 AND r.fecha_fin >= $3) OR
          (r.fecha_inicio <= $4 AND r.fecha_fin >= $4) OR
          (r.fecha_inicio >= $3 AND r.fecha_fin <= $4)
        )
      )
    `;
    const { rows } = await pool.query(query, [
      adultos || 0,
      ninos || 0,
      fechaInicio,
      fechaFin
    ]);
    return rows;
  }

  static async create({ nombre, descripcion, precio, capacidad, imagen }) {
    const query = `
      INSERT INTO cabanas (nombre, descripcion, precio, capacidad, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [nombre, descripcion, precio, capacidad, imagen];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, { nombre, descripcion, precio, capacidad, imagen, disponible, destacada }) {
    const query = `
      UPDATE cabanas
      SET 
        nombre = $1, 
        descripcion = $2, 
        precio = $3, 
        capacidad = $4, 
        imagen = $5, 
        disponible = $6, 
        destacada = $7,
        actualizado_en = NOW()
      WHERE id = $8
      RETURNING *
    `;
    const values = [
      nombre, 
      descripcion, 
      precio, 
      capacidad, 
      imagen, 
      disponible, 
      destacada,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM cabanas WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Cabana;
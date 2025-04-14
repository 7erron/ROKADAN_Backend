const pool = require('../config/db');

class Cabana {
  static async findAll() {
    try {
      const { rows } = await pool.query(`
        SELECT id, nombre, descripcion, precio, capacidad, imagen, disponible, 
               creado_en, actualizado_en
        FROM cabanas 
        WHERE disponible = true
      `);
      
      return rows.map(row => ({
        ...row,
        imagen: row.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
      }));
    } catch (error) {
      console.error('Error en Cabana.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await pool.query(`
        SELECT id, nombre, descripcion, precio, capacidad, imagen, disponible,
               creado_en, actualizado_en
        FROM cabanas 
        WHERE id = $1
      `, [id]);
      
      if (rows.length === 0) return null;
      
      return {
        ...rows[0],
        imagen: rows[0].imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
      };
    } catch (error) {
      console.error('Error en Cabana.findById:', error);
      throw error;
    }
  }

  static async findDestacadas() {
    try {
      const { rows } = await pool.query(`
        SELECT id, nombre, descripcion, precio, capacidad, imagen, disponible,
               creado_en, actualizado_en
        FROM cabanas 
        WHERE disponible = true 
        ORDER BY creado_en DESC 
        LIMIT 2
      `);
      
      return rows.map(row => ({
        ...row,
        imagen: row.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
      }));
    } catch (error) {
      console.error('Error en Cabana.findDestacadas:', error);
      throw error;
    }
  }

  static async findDisponibles(fechaInicio, fechaFin, adultos = 1, ninos = 0) {
    try {
      const capacidadTotal = parseInt(adultos) + parseInt(ninos);
      
      const { rows } = await pool.query(`
        SELECT c.id, c.nombre, c.descripcion, c.precio, c.capacidad, c.imagen,
               c.disponible, c.creado_en, c.actualizado_en
        FROM cabanas c
        WHERE c.disponible = true
        AND c.capacidad >= $1
        AND c.id NOT IN (
          SELECT r.cabana_id 
          FROM reservas r
          WHERE r.estado != 'cancelada'
          AND (
            (r.fecha_inicio <= $2 AND r.fecha_fin >= $2) OR
            (r.fecha_inicio <= $3 AND r.fecha_fin >= $3) OR
            (r.fecha_inicio >= $2 AND r.fecha_fin <= $3)
          )
        )
      `, [capacidadTotal, fechaInicio, fechaFin]);
      
      return rows.map(row => ({
        ...row,
        imagen: row.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
      }));
    } catch (error) {
      console.error('Error en Cabana.findDisponibles:', error);
      throw error;
    }
  }

  static async create(cabanaData) {
    try {
      const { rows } = await pool.query(`
        INSERT INTO cabanas (
          nombre, descripcion, precio, capacidad, imagen, disponible
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, nombre, descripcion, precio, capacidad, imagen, disponible,
                  creado_en, actualizado_en
      `, [
        cabanaData.nombre,
        cabanaData.descripcion,
        cabanaData.precio,
        cabanaData.capacidad,
        cabanaData.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible',
        cabanaData.disponible !== false
      ]);
      
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.create:', error);
      throw error;
    }
  }

  static async update(id, cabanaData) {
    try {
      const { rows } = await pool.query(`
        UPDATE cabanas
        SET nombre = $1, 
            descripcion = $2, 
            precio = $3, 
            capacidad = $4, 
            imagen = $5, 
            disponible = $6, 
            actualizado_en = NOW()
        WHERE id = $7
        RETURNING id, nombre, descripcion, precio, capacidad, imagen, disponible,
                  creado_en, actualizado_en
      `, [
        cabanaData.nombre,
        cabanaData.descripcion,
        cabanaData.precio,
        cabanaData.capacidad,
        cabanaData.imagen || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible',
        cabanaData.disponible !== false,
        id
      ]);
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { rows } = await pool.query(`
        DELETE FROM cabanas 
        WHERE id = $1
        RETURNING id, nombre
      `, [id]);
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.delete:', error);
      throw error;
    }
  }
}

module.exports = Cabana;
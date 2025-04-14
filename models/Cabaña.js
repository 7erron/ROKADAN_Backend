const pool = require('../config/db');

class Cabana {
  // Verificador de conexión reutilizable
  static async _checkConnection() {
    if (!pool || typeof pool.query !== 'function') {
      throw new Error('Pool de conexiones no está disponible');
    }

    try {
      await pool.query('SELECT 1'); // Consulta de prueba
    } catch (err) {
      console.error('Error de conexión a la DB:', err);
      throw new Error('Error al conectar con la base de datos');
    }
  }

  static async findAll() {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(`
        SELECT *, 
        CASE WHEN imagen IS NULL OR imagen = '' 
          THEN 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
          ELSE imagen
        END AS imagen
        FROM cabanas 
        WHERE disponible = true
      `);
      
      return rows;
    } catch (error) {
      console.error('Error en Cabana.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(
        `SELECT *,
        COALESCE(imagen, 'https://via.placeholder.com/800x600?text=Imagen+no+disponible') AS imagen
        FROM cabanas 
        WHERE id = $1`,
        [id]
      );
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.findById:', error);
      throw error;
    }
  }

  static async findDestacadas() {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(`
        SELECT *,
        COALESCE(imagen, 'https://via.placeholder.com/800x600?text=Imagen+no+disponible') AS imagen
        FROM cabanas 
        WHERE disponible = true 
        AND destacada = true
        ORDER BY creado_en DESC 
        LIMIT 2
      `);
      
      return rows;
    } catch (error) {
      console.error('Error en Cabana.findDestacadas:', error);
      throw error;
    }
  }

  static async findDisponibles(fechaInicio, fechaFin, adultos = 1, ninos = 0) {
    try {
      await this._checkConnection();
      
      const capacidadTotal = parseInt(adultos) + parseInt(ninos);
      
      const { rows } = await pool.query(
        `SELECT c.*,
        COALESCE(c.imagen, 'https://via.placeholder.com/800x600?text=Imagen+no+disponible') AS imagen
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
        )`,
        [capacidadTotal, fechaInicio, fechaFin]
      );
      
      return rows;
    } catch (error) {
      console.error('Error en Cabana.findDisponibles:', error);
      throw error;
    }
  }

  static async create(cabanaData) {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(
        `INSERT INTO cabanas (
          nombre, descripcion, precio, capacidad, imagen, destacada
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          cabanaData.nombre,
          cabanaData.descripcion,
          cabanaData.precio,
          cabanaData.capacidad,
          cabanaData.imagen || null,
          cabanaData.destacada || false
        ]
      );
      
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.create:', error);
      throw error;
    }
  }

  static async update(id, cabanaData) {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(
        `UPDATE cabanas
        SET 
          nombre = $1,
          descripcion = $2,
          precio = $3,
          capacidad = $4,
          imagen = $5,
          destacada = $6,
          disponible = $7,
          actualizado_en = NOW()
        WHERE id = $8
        RETURNING *`,
        [
          cabanaData.nombre,
          cabanaData.descripcion,
          cabanaData.precio,
          cabanaData.capacidad,
          cabanaData.imagen || null,
          cabanaData.destacada || false,
          cabanaData.disponible !== false,
          id
        ]
      );
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await this._checkConnection();
      
      const { rows } = await pool.query(
        'DELETE FROM cabanas WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error('Error en Cabana.delete:', error);
      throw error;
    }
  }
}

module.exports = Cabana;
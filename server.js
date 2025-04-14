const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

// Probar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } else {
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0]);
    // Iniciar servidor solo si la conexión a la DB es exitosa
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  }
});
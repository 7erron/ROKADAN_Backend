-- Creacion de base de datos
CREATE DATABASE cabanas_rokadan;

-- Conexión a la base de datos
\c cabanas_rokadan

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password VARCHAR(100) NOT NULL,
  es_admin BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear la tabla de cabañas
CREATE TABLE cabanas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  capacidad INTEGER NOT NULL,
  imagen VARCHAR(255),
  disponible BOOLEAN DEFAULT TRUE,
  destacada BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear la tabla de servicios
CREATE TABLE servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear la tabla de reservas
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  cabana_id INTEGER REFERENCES cabanas(id) ON DELETE SET NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  adultos INTEGER NOT NULL,
  ninos INTEGER DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'pendiente',
  total NUMERIC(10, 2) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla intermedia para servicios en reservas
CREATE TABLE reserva_servicios (
  reserva_id INTEGER REFERENCES reservas(id) ON DELETE CASCADE,
  servicio_id INTEGER REFERENCES servicios(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 1,
  PRIMARY KEY (reserva_id, servicio_id)
);

-- Insertar usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, apellido, email, telefono, password, es_admin)
VALUES ('Admin', 'Rokadan', 'admin@cabanas.com', '912345678', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H3zQmYPl/5E7z8X7YV2Q5JQlH6O', true);

-- Insertar cabañas
INSERT INTO cabanas (nombre, descripcion, precio, capacidad, imagen)
VALUES 
  ('Cabaña El Pinar', 'Hermosa cabaña en medio del bosque con vistas panorámicas.', 25000, 4, 'https://imagen1.jpg'),
  ('Cabaña La Montaña', 'Acogedora cabaña de montaña ideal para desconectar.', 32000, 6, 'https://imagen2.jpg'),
  ('Cabaña El Lago', 'Moderna cabaña con acceso directo al lago.', 45000, 8, 'https://imagen3.jpg');

-- Insertar servicios
INSERT INTO servicios (nombre, descripcion, precio)
VALUES 
  ('Desayuno Incluido', 'Desayuno completo con productos locales y caseros.', 5000),
  ('WiFi Gratis', 'Conexión WiFi de alta velocidad en la cabaña.', 0),
  ('Piscina', 'Acceso a piscina climatizada.', 10000),
  ('Chimenea', 'Chimenea interior para noches frías.', 8000);
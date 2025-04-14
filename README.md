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
  ('Cabaña El Pinar', 'Hermosa cabaña en medio del bosque con vistas panorámicas.', 25000, 4, 'https://img.freepik.com/fotos-premium/cabana-ubicada-bosque-vistas-majestuosas-montanas-vista-panoramica-cabana-acogedora-ubicada-montanas-vista-panoramica_538213-117682.jpg?w=996'),
  ('Cabaña La Montaña', 'Acogedora cabaña de montaña ideal para desconectar.', 32000, 6, 'https://a0.muscache.com/im/pictures/cc8ea353-3f63-4d4d-ba2f-baac82e62318.jpg?im_w=1200'),
  ('Cabaña El Lago', 'Moderna cabaña con acceso directo al lago.', 45000, 8, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/515320035.jpg?k=c51839eac8f74086e2d9a61f90dfdf0c739a632221bf4c08c88419ee47c696aa&o=');

-- Insertar servicios
INSERT INTO servicios (nombre, descripcion, precio)
VALUES 
  ('Desayuno Incluido', 'Desayuno completo con productos locales y caseros.', 5000),
  ('WiFi Gratis', 'Conexión WiFi de alta velocidad en la cabaña.', 0),
  ('Piscina', 'Acceso a piscina climatizada.', 10000),
  ('Chimenea', 'Chimenea interior para noches frías.', 8000);

-- Ampliar caracteres
ALTER TABLE cabanas ALTER COLUMN imagen TYPE text;

  -- Actualizar imágenes para las cabañas existentes
UPDATE cabanas SET 
  imagen = 'https://img.freepik.com/fotos-premium/cabana-ubicada-bosque-vistas-majestuosas-montanas-vista-panoramica-cabana-acogedora-ubicada-montanas-vista-panoramica_538213-117682.jpg?w=996'
WHERE id = 1;

UPDATE cabanas SET 
  imagen = 'https://a0.muscache.com/im/pictures/cc8ea353-3f63-4d4d-ba2f-baac82e62318.jpg?im_w=1200'
WHERE id = 2;

UPDATE cabanas SET 
  imagen = 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/515320035.jpg?k=c51839eac8f74086e2d9a61f90dfdf0c739a632221bf4c08c88419ee47c696aa&o='
WHERE id = 3;

UPDATE cabanas SET 
  imagen = 'https://www.hotelesparaadultos.com/img5/lapau-casasruralesbarcelona.jpg'
WHERE id = 4;

UPDATE cabanas SET 
  imagen = 'https://scontent.fscl7-1.fna.fbcdn.net/v/t1.6435-9/89657016_2938038996234673_600702587104133120_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QPLzRlLTFCwQ7kNvwEdLAte&_nc_oc=AdkkiteEXSH6gIqsfbKfHqwR2rHqSSajXeQ2ijkjBQ5KbPgUPEOJzA3w4iDFXedeiIw&_nc_zt=23&_nc_ht=scontent.fscl7-1.fna&_nc_gid=2chSFsdLNiV9a3U2wE8uRg&oh=00_AYFBUVXMdbe1cdmtSeF16UXq0fNO0EO0JGf9io-_jIOtZQ&oe=68183E7E'
WHERE id = 5;

UPDATE cabanas SET 
  imagen = 'https://www.monteverdepucon.cl/wp-content/uploads/2018/12/Caba%C3%B1a-3-dorm-6-hu%C3%A9spedes-Monte-Verde-Puc%C3%B3n-1.jpg'
WHERE id = 6;

UPDATE cabanas SET 
  imagen = 'https://a0.muscache.com/im/pictures/b405b047-ae5b-4ee0-a035-cd0672a56b84.jpg?im_w=960'
WHERE id = 7;

UPDATE cabanas SET 
  imagen = 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIxODgzODM3ODE1MjcxNjg2OA%3D%3D/original/d6157fb1-79f6-4dc1-ba5e-4dca515c8faa.jpeg?im_w=1200'
WHERE id = 8;

UPDATE cabanas SET 
  imagen = 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzY0NDMzMTAzMDQ5NTYxODUx/original/d37cda3e-de11-4581-afd4-7c0be034434c.jpeg?im_w=720'
WHERE id = 9;

-- Índices
CREATE INDEX idx_reservas_fechas ON reservas (fecha_inicio, fecha_fin);
CREATE INDEX idx_cabanas_capacidad ON cabanas (capacidad);
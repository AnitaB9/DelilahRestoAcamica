CREATE DATABASE IF NOT EXISTS delilahresto;

USE delilahresto;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULLdelilahresto PRIMARY KEY AUTO_INCREMENT,
  name_usuario VARCHAR(50) NOT NULL,
  password VARCHAR(150) NOT NULL,
  nombre_completo VARCHAR(200) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR (60) NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  administrador BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS productos
(
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  nombre_producto VARCHAR(100) NOT NULL,
  precio FLOAT NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  item VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados
(
	id_estado INT PRIMARY KEY AUTO_INCREMENT,
	descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos
(
  id_pedido INT PRIMARY KEY AUTO_INCREMENT,
  usuario_pedido INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT NOW(),
  estado INT NOT NULL DEFAULT 1,
  metodo_pago VARCHAR(100) NOT NULL,
  total FLOAT NOT NULL,
  FOREIGN KEY (usuario_pedido) REFERENCES usuarios (id_usuario),
  FOREIGN KEY (estado) REFERENCES estados(id_estado)
);

CREATE TABLE IF NOT EXISTS detalle_pedidos
(
  id_detalle_pedido INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  producto INT NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (producto) REFERENCES productos (id_producto)
);

--------- Carga estados---------------
INSERT INTO estados VALUES
  (
    NULL,
    "nuevo"
  ),
  (
    NULL,
    "confirmado"
  ),
  (
    NULL,
    "preparando"
  ),
  (
    NULL,
    "en camino"
  ),
  (
  	 NULL,
  	 "entregado"
  	),
  (
    NULL,
    "cancelado"
  );

--------- Carga productos---------------

INSERT INTO productos VALUES
  (
    NULL,
    "Bagel de Salmón",
    425,
    "Bagel de Salmón con queso ciboulette",
    "bagSal"
  ),
  (
    NULL,
    "Hamburguesa Clásica",
    350,
    "Hamburguesa con cheddar doble de la casa acompañada de papas",
    "hamClas"
  ),
  (
    NULL,
    "Sandwich Veggie",
    310,
    "Sandwich vegetariano de palta, tomate y berenjenas",
    "sandVeg"
  ),
  (
    NULL,
    "Ensalada Veggie",
    340,
    "Ensalada de hojas verdes",
    "ensVeg"
  ),
  (
    NULL,
    "Focaccia",
    300,
    "Pan relleno de aceitunas y queso brie",
    "foca"
  ),
  (
    NULL,
    "Sandwich Focaccia",
    440,
    "Sandwich de focaccia y salmón",
    "sanFoca"
  );
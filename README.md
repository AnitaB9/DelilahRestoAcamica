# DelilahRestoAcamica
Tercer proyecto acamica

Recursos utilizados:

Node.js

Nodemon

Express

Jasonwebtoken para autenticación via Token

Bcrypt para hashear passwords

MySQL Base de Datos

Postman

Objetivo Realizar Backend de una app de pedidos de comidas.

Pasos a seguir:

---1--- Descargar el Proyecto dessde el siguiente link: https://github.com/AnitaB9/DelilahRestoAcamica

---2--- Instalar dependencias utilizadas: npm install

---3--- Crear la Base de Datos teniendo en cuenta la sentencia del archivo delilahRestoBD (/BD/delilahRestoBD.sql): CREATE DATABASE IF NOT EXISTS delilahresto;

---4--- Crear las Tablas teniendo en cuenta cada sentencia del archivo delilahRestoBD (/BD/delilahRestoBD.sql): CREATE TABLE IF NOT EXISTS;

---5--- Agregar Valores iniciales de ejemplo para tablas Productos y Estados teniendo en cuenta la sentencia del archivo delilahRestoBD (/BD/delilahRestoBD.sql): SELECT * FROM (nombre tabla) INSERT INTO (nombre tabla) VALUES;

---6--- Asegurarse de agregar Usuario y Password de acceso a la base de datos creada. Archivo /BD/delilahRestoBD.js.

---7--- Inicializar el servidor desde visual Studio ejecutando: node index.js

---8--- Abrir Postman e importar la colección de endpoints para comenzar a utilizar la app desde el archivo tools/DelilahResto.postman_collection.json

DOCUMENTACION

-- TOKEN

Key: Authorization Value: Bearer (colocar token generado al momento de crear el usuario)

#RUTAS

USUARIOS

Crear ssuario
Crear administrador
Login usuario
Lista Usuarios (Solo adminitrador) REQUIERE TOKEN
PRODUCTOS (REQUIEREN TOKEN)

Lista roductos
Agregar producto (Solo admin)
Eliminar producto por id (solo admin)
Editar producto por id (solo admin)
PEDIDOS (REQUIERE TOKEN)

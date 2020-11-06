const jwt = require("jsonwebtoken");
const secret = require("../config/jwt");
const mySqlOn = require('../BD/delilahRestoBD');

/*--------- MANEJO DE ERRORES----------*/

function manejoDeErrores(err, req, res, next) {
  if (err) {
    console.log("Trace del error", err);
    res.status(500).send("Ha ocurrido un error inesperado.");
    return;
  }
  next();
}

/* ----------- AUTENTICACIÓN ---------- */

function autenticacion (req, res, next) {
  let auth = req.headers.authorization;

  if (!auth) {
    res.status(401).send("No tiene autorización.");
    return;
  }

  let token = auth.split(" ")[1];

  if (!token) {
    res.status(401).send("No tiene autorización!!.");
    return;
  }

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      res.status(500).send("Hubo un problema con el token.");
      return;
    }
    req.userInfo = payload;
    next();
  });
}

/* ------- AUTENTICACIÓN ADMIN --------- */

function autenticacionAdmin (req, res, next) {
  if (req.userInfo.administrador != 1) {
    res.status(401).send("No tiene acceso para realizar esta consulta.");
    return;
  }
  next();
}


/* ------- CHECK USUARIO --------- */

function checkIdUsuario(req, res, next) {
  let id = req.params.id;

  if (req.userInfo.id_usuario == id || req.userInfo.administrador == 1) {
    next();
  } else {
    res.status(401).send("No tiene acceso para realizar esta consulta");
    return;
  }
}

/* ------- CHECK USUARIO EXISTENTE ---------- */

function checkUsuarioExistente(req, res, next) {
  let usuario = req.body.usuario;

  mySqlOn.query(`SELECT name_usuario FROM usuarios WHERE name_usuario = '${usuario}'`, (err, result) => {
    if (!err) {
      if (result.length !== 0) {
        res.status(400).send('El Nombre de Usuario ya existe, por favor itente con otro nombre.');
      } else {
        next();
      }
    } else {
      console.log(err);
    }
  })
};


module.exports = {
  manejoDeErrores: manejoDeErrores,
  autenticacion: autenticacion,
  autenticacionAdmin: autenticacionAdmin,
  checkIdUsuario: checkIdUsuario,
  checkUsuarioExistente: checkUsuarioExistente,
}
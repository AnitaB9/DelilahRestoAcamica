const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysqlOn = require('../BD/delilahRestoBD');
const secretauth = require('../config/jwt');


/* ------------- CREAR USUARIO ------------- */
function crearUsuario(req, res) {
    let { usuario, password, nombre_completo, email, telefono, direccion } = req.body;

    if (usuario && password && nombre_completo && email && telefono && direccion) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                res.status(500).send("No se pudo registrar el usuario");
                return;
            }
            password = hash;

            let insertUsuario = `INSERT INTO usuarios (name_usuario, password, nombre_completo, email, telefono, direccion) 
                    VALUES ('${usuario}', '${password}', '${nombre_completo}', '${email}', '${telefono}', '${direccion}')`;

            mysqlOn.query(insertUsuario, (err, result) => {
                if (err) throw err;
                console.log(result);
                res.status(200).send('Usuario Creado con Éxito');
            });
        });
    } else {
        res.status(400).send("Error al registrar el Usuario, faltan datos!");
    };
};


/* ------------- CREAR ADMIN ------------- */
function crearAdmin(req, res) {
    let { usuario, password, nombre_completo, email, telefono, direccion, administrador } = req.body;
    if (usuario && password && nombre_completo && email && telefono && direccion && administrador) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                res.status(500).send("No se pudo registrar el usuario");
                return;
            }
            password = hash;

            let insertAdmin = `INSERT INTO usuarios (name_usuario, password, nombre_completo, email, telefono, direccion, administrador) 
                VALUES ('${usuario}', '${password}', '${nombre_completo}', '${email}', '${telefono}', '${direccion}', '${administrador}')`;

            mysqlOn.query(insertAdmin, (err, result) => {
                if (err) throw err;
                console.log(result);
                res.status(200).send('Usuario Administrador creado con éxito');
            });
        });
    } else {
        res.status(400).send("Error al registrar el Administrador");
    }
};


/* ------------- LOGIN USUARIOS ------------- */
function login(req, res) {
    let name_usuario = req.body.usuario;
    let password = req.body.password;

    let queryLogin = `SELECT id_usuario, name_usuario, password, administrador FROM usuarios WHERE name_usuario = '${name_usuario}'`;

    mysqlOn.query(queryLogin, (err, result) => {
        if (err) throw err;

        if (result.length == 0) {
            res.status(400).send("El usuario o contraseña son incorrectos");
            return;
        }
        bcrypt.compare(password, result[0].password, function (err, bcryptResult) {
            if (err) {
                res.status(500).send("No es posible validar el password");
                return;
            }
            if (!bcryptResult) {
                res.status(400).send("usuario o contraseña incorrecto");
                return;
            }

            let payload = {
                name_usuario: result[0].name_usuario,
                id_usuario: result[0].id_usuario,
                administrador: result[0].administrador,
            }

            // genero el token.
            jwt.sign(payload, secretauth, (err, token) => {
                if (err) {
                    res.status(500).send("No es posible iniciar sesion");
                    return;
                }

                let resultado = {
                    name_usuario: result[0].name_usuario,
                    id_usuario: result[0].id_usuario,
                    administrador: result[0].administrador,
                    token: token,
                };
                res.send(resultado);
            });
        });
    })
}


module.exports = {
    crearUsuario: crearUsuario,
    crearAdmin: crearAdmin,
    login: login,
}
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const controladores = require('../controllers/controllers');
const autenticacion = require('../controllers/authentication');
const middleware = require ('../middlewares/middlewares');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


/* ---------- NUEVO USUARIO ---------- */
router.post('/usuarios', middleware.checkUsuarioExistente, autenticacion.crearUsuario);

/* ---------- NUEVO ADMIN ---------- */
router.post('/admin',middleware.checkUsuarioExistente, autenticacion.crearAdmin);

/* ---------- LOGIN ---------- */
router.post('/login', autenticacion.login);

/* ---------- LISTA USUARIOS ---------- */
router.get('/usuarios', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.listaUsuarios);

/* ---------- LISTA PRODUCTOS ---------- */
router.get('/productos', middleware.autenticacion, controladores.listaProductos);

/* ---------- LISTAR PRODUCTOS POR ID ---------- */
router.get('/productos/:id', middleware.autenticacion, controladores.listarProductosId);

/* ---------- AGREGAR UN PRODUCTO ---------- */
router.post('/productos', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.agregarProducto);

/* ---------- EDITAR PRODUCTO ---------- */
router.put('/productos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.editarProducto);

/* ---------- ELIMINAR UN PRODUCTO ---------- */
router.delete('/productos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.eliminarProducto);

/* ---------- GENERAR PEDIDO ---------- */
router.post('/pedidos', middleware.autenticacion, controladores.generarPedido);

/* ---------- LISTA PEDIDOS ---------- */
router.get('/pedidos', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.listaPedidos);
    
/* ---------- LISTAR PEDIDOS POR USUARIO --------- */
router.get('/pedidos/:id', [middleware.autenticacion, middleware.checkIdUsuario], controladores.listarPedidosUsuario);

/* ---------- ACTUALIZAR ESTADO DE PEDIDO ---------- */
router.put('/pedidos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.actualizarEstadoPedido);

/* ---------- ELIMINAR UN PEDIDO ---------- */
router.delete('/pedidos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.eliminarPedido);

/* ---------- AGREGAR UN PRODUCTO ---------- */
router.post('/productos', [middleware.autenticacion, middleware.autenticacion], controladores.agregarProducto);

/* ---------- EDITAR PRODUCTO ---------- */
router.put('/productos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.editarProducto);

/* ---------- ELIMINAR UN PRODUCTO ---------- */
router.delete('/productos/:id', [middleware.autenticacion, middleware.autenticacionAdmin], controladores.eliminarProducto);


module.exports = router;
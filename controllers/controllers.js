const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const mysqlOn = require('../BD/delilahRestoBD');

/* --------- LISTA USUARIOS --------- */
function listaUsuarios(req, res) {
    mysqlOn.query('SELECT * FROM usuarios', (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            console.log(err);
        }
    })
};

/* --------- LISTA PRODUCTOS --------- */
function listaProductos(req, res) {
    mysqlOn.query('SELECT * FROM productos', (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            console.log(err);
        }
    })
};

/* --------- LISTAR PRODUCTOS POR ID --------- */
function listarProductosId(req, res) {
    let id = req.params.id;
    let queryProductos = `SELECT t.id_producto, t.nombre_producto, t.precio, t.descripcion, t.item FROM productos t WHERE id_producto = ${id}`;

    mysqlOn.query(queryProductos, (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    })
}

/* --------- AGREGAR PRODUCTO --------- */
function agregarProducto(req, res) {
    let { nombre_producto, precio, descripcion, item } = req.body;
    let queryInsertProducto = `INSERT INTO productos (nombre_producto, precio, descripcion, item) 
        VALUES ('${nombre_producto}', '${precio}', '${descripcion}', '${item}')`;

    mysqlOn.query(queryInsertProducto, (err, result) => {
        if (err) throw err;
        res.status(200).send('Producto guardado con éxito');
    })
};

/* --------- EDITAR PRODUCTO --------- */
function editarProducto(req, res) {
    let id = req.params.id;
    let { nombre, precio, descripcion, item } = req.body;
    let queryActualizarProducto = `UPDATE productos SET nombre_producto = '${nombre}', precio = ${precio}, descripcion = '${descripcion}', item = '${item}' WHERE id_producto = ${id}`;

    mysqlOn.query(queryActualizarProducto, (err, result) => {
        if (err) throw err;
        res.status(200).send("Producto actualizado con éxito");
    })
};

/* --------- ELIMINAR PRODUCTO --------- */
function eliminarProducto(req, res) {
    let id = req.params.id;
    let queryEliminarProducto = `DELETE FROM productos WHERE id_producto = ${id}`;

    mysqlOn.query(queryEliminarProducto, (err, result) => {
        if (err) throw err;
        res.status(200).send("Producto eliminado con éxito");
    })
};

/* --------- GENERAR PEDIDO --------- */
function generarPedido(req, res) {
    let { usuario, descripcion, metodo_pago } = req.body;
    let totalGeneral = 0;

    descripcion.forEach((detalle) => {
        let queryObtenerPrecio = `SELECT precio FROM productos WHERE id_producto = ${detalle.producto}`;
        mysqlOn.query(queryObtenerPrecio, (err, result) => {
            if (err) throw err;
            let totalProducto = result[0].precio * detalle.cantidad;
            totalGeneral += totalProducto;
        })
    });

    mysqlOn.beginTransaction(function (err) {
        if (err) throw err;

        let queryInsertPedido = `INSERT INTO pedidos (usuario_pedido, metodo_pago, total) 
            VALUES ('${usuario}', '${metodo_pago}', '${totalGeneral}')`;
        mysqlOn.query(queryInsertPedido, (err, result) => {
            if (err) {
                mysqlOn.rollback(function () {
                    throw err;
                });
            } else {
                let idPedido = result.insertId;
                descripcion.forEach(detalle => {

                    let queryInsertDetallePedido = `INSERT INTO detalle_pedidos (id_pedido, producto, cantidad) 
                    VALUES ('${idPedido}', '${detalle.producto}', '${detalle.cantidad}')`;

                    mysqlOn.query(queryInsertDetallePedido, (err, result) => {
                        if (err) {
                            mysqlOn.rollback(function () {
                                throw err;
                            });
                        }
                    })
                });
                mysqlOn.commit(function (err) {
                    if (err) {
                        mysqlOn.rollback(function () {
                            throw err;
                        });
                    }
                });
                res.send('Pedido generado con éxito!');
            }
        });
    });
}

/* --------- LISTA PEDIDOS --------- */
function listaPedidos(req, res) {
    mysqlOn.query('SELECT detalle_pedidos.id_pedido, pedidos.usuario_pedido, pedidos.fecha, pedidos.estado, detalle_pedidos.producto, detalle_pedidos.cantidad, pedidos.total FROM detalle_pedidos INNER JOIN pedidos ON detalle_pedidos.id_pedido = pedidos.id_pedido', (err, result) => {
        if (!err) {
            let objetoResultado = [];
            result.forEach((pedidoBD) => {
                let elPedidoNoEstaAgregado = true;

                objetoResultado.forEach((pedidoYaAgregado) => {
                    if (pedidoYaAgregado.id_pedido === pedidoBD.id_pedido) {
                        elPedidoNoEstaAgregado = false;
                        pedidoYaAgregado.descripcion.push(
                            {
                                producto: pedidoBD.producto,
                                cantidad: pedidoBD.cantidad,
                            }
                        )
                    }
                })

                if (elPedidoNoEstaAgregado) {
                    const nuevoObjetoPedido = {
                        id_pedido: pedidoBD.id_pedido,
                        usuario_pedido: pedidoBD.usuario_pedido,
                        fecha: pedidoBD.fecha,
                        estado: pedidoBD.estado,
                        descripcion: [],
                        total: pedidoBD.total,
                    }
                    nuevoObjetoPedido.descripcion.push(
                        {
                            producto: pedidoBD.producto,
                            cantidad: pedidoBD.cantidad,
                        }
                    )
                    objetoResultado.push(nuevoObjetoPedido);
                }
            })
            res.status(200).send(objetoResultado);
        } else {
            console.log(err);
        }
    })
};

/* --------- LISTAR PEDIDOS DE UN USUARIO --------- */
function listarPedidosUsuario(req, res) {
    let id = req.params.id;
    let queryPedidos = `SELECT detalle_pedidos.id_pedido, pedidos.usuario_pedido, pedidos.fecha, pedidos.estado, detalle_pedidos.producto, detalle_pedidos.cantidad, pedidos.total FROM detalle_pedidos INNER JOIN pedidos ON detalle_pedidos.id_pedido = pedidos.id_pedido WHERE pedidos.usuario_pedido = ${id}`;

    mysqlOn.query(queryPedidos, (err, result) => {
        if (!err) {
            let objetoResultado = [];
            result.forEach((pedidoBD) => {
                let elPedidoNoEstaAgregado = true;

                objetoResultado.forEach((pedidoYaAgregado) => {
                    if (pedidoYaAgregado.id_pedido === pedidoBD.id_pedido) {
                        elPedidoNoEstaAgregado = false;
                        pedidoYaAgregado.descripcion.push(
                            {
                                producto: pedidoBD.producto,
                                cantidad: pedidoBD.cantidad,
                            }
                        )
                    }
                })

                if (elPedidoNoEstaAgregado) {
                    const nuevoObjetoPedido = {
                        id_pedido: pedidoBD.id_pedido,
                        usuario_pedido: pedidoBD.usuario_pedido,
                        fecha: pedidoBD.fecha,
                        estado: pedidoBD.estado,
                        descripcion: [],
                        total: pedidoBD.total,
                    }
                    nuevoObjetoPedido.descripcion.push(
                        {
                            producto: pedidoBD.producto,
                            cantidad: pedidoBD.cantidad,
                        }
                    )
                    objetoResultado.push(nuevoObjetoPedido);
                }
            })
            res.status(200).send(objetoResultado);
        } else {
            console.log(err);
        }
    })
};

/* --------- ACTUALIZAR ESTADO DE PEDIDO --------- */
function actualizarEstadoPedido(req, res) {
    let id = req.params.id;
    let estado = req.body.estado;
    let queryEstadoPedidos = `UPDATE pedidos SET estado = ${estado} WHERE id_pedido = ${id}`;

    mysqlOn.query(queryEstadoPedidos, (err, result) => {
        if (err) throw err;
        res.status(200).send("Estado actualizado con éxito");
    })
};

/* --------- ELIMINAR PEDIDO --------- */
function eliminarPedido(req, res) {
    let id = req.params.id;
    let queryEliminarPedido = `DELETE FROM pedidos WHERE id_pedido = ${id}`;

    mysqlOn.query(queryEliminarPedido, (err, result) => {
        if (err) throw err;
        res.status(200).send("Pedido eliminado con Éxito!");
    })
};



module.exports = {
    listaUsuarios: listaUsuarios,
    listaProductos: listaProductos,
    listarProductosId: listarProductosId,
    agregarProducto: agregarProducto,
    editarProducto: editarProducto,
    eliminarProducto: eliminarProducto,
    generarPedido: generarPedido,
    listaPedidos: listaPedidos,
    listarPedidosUsuario: listarPedidosUsuario,
    actualizarEstadoPedido: actualizarEstadoPedido,
    eliminarPedido: eliminarPedido,
}
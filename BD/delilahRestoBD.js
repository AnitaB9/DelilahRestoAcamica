const mysql = require('mysql');
const mySqlOn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '38419667',
    database: 'delilahresto'
});

mySqlOn.connect(err => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Conectado Correctamente a la Base de Datos Delilah Resto');
    }
})

module.exports = mySqlOn;
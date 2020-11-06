const express = require("express");
const app = express();

const port = process.env.PORT || 3080;

/* ----------- MIDDLEWARE -------- */
const middleware = require ('./middlewares/middlewares');
app.use(middleware.manejoDeErrores);

/* ------ RUTAS --------- */
app.use(require('./routes/routes'));


app.listen(port,() => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
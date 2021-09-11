const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env.local'});

const negociosRoute = require("./routes/negocios");
const productosRoute = require("./routes/productos");
const usuariosRoute = require('./routes/usuarios');

//INICIALIZACIONES-------------------------------------------------
const app = express();

//MIDDLEWARES------------------------------------------
//app.use(morgan('combined'));
app.use(express.urlencoded({extended:false}))//para q cuando envien un POST desde un form lo entienda
app.use(express.json());//para q entienda objetos json
app.use(morgan('dev'));
app.use(cors());//para q permita q cualquier servidor pida cosas y haga operaciones


//SETTINGS---------------------------------------------
app.set('port', process.env.PORT || 8080);
app.set('json spaces', 2);

//ROUTES-----------------------------------------------
//app.use(require('./routes/videos.route'));
app.use('/negocios', negociosRoute);
app.use('/productos', productosRoute);
app.use('/usuarios', usuariosRoute);

//STATIC-FILES-----------------------------------------

//DB-CONNECTION----------------------------------------
try {
    const dbConnection = mongoose.connect(process.env.MONGODB_URI, 
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        function() {
            console.log('Conectado a la base de datos');
    });
}
catch(err){
    console.log(err);
}

module.exports=app
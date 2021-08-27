const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

const holaMundo = require ("./routes/holaMundo")

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
app.use(holaMundo);

//STATIC-FILES-----------------------------------------


module.exports=app
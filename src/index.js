const app = require('./app');


//inicio el server-------------------------------------
app.listen(app.get('port'),()=>{
    console.log('Escuchando el puerto', app.get('port'));
})
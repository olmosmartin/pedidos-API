const Repartidor = require('../models/Repartidor');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const getRepartidor = async (req, res) => {
    try{
        const repartidores = await Repartidor.findById(req.params.repartidorId).populate('usuario');
        res.json(repartidores);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
}

const postRepartidor = async (req, res) => {
    try{
        const emailExists = await Usuario.findOne({ email: req.body.email });
        if(emailExists) return res.status(400).send('El email ingresado ya existe');

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: hashedPassword,
            telefono: req.body.telefono,
            role: 'REPARTIDOR'
        });
        await usuario.save();

        const repartidor = new Repartidor({
            usuario: usuario
        });

        var savedRepartidor = await repartidor.save();
        savedRepartidor = savedRepartidor.toJSON();
        delete savedRepartidor.usuario.password;
        res.json(savedRepartidor);
        res.end();
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getRepartidor,
    postRepartidor
}


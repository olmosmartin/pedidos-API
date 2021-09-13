const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Direccion = require('../models/Direccion');
const bcrypt = require('bcryptjs');

const getCliente = async (req, res) => {
    try{
        const clientes = await Cliente.findById(req.params.clienteId).populate('usuario');
        res.json(clientes);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
}

const getAllClientes = async (req, res) => {
    try{
        const clientes = await Cliente.find().populate('usuario');
        res.json(clientes);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postCliente = async (req, res) => {
    try{
        //Toda esta parte se repite en negocio quizas habria que unificarlo en un middleware u otra cosa.
        const emailExists = await Usuario.findOne({ email: req.body.email });
        if(emailExists) return res.status(400).send('El email ingresado ya existe');
        console.log(req.body);
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: hashedPassword,
            telefono: req.body.telefono,
            role: 'CLIENTE'
        });
        await usuario.save();

        const direccion = new Direccion({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        });

        const cliente = new Cliente({
            usuario: usuario,
            direccion: direccion
        });

        var savedCliente = await cliente.save();
        savedCliente = savedCliente.toJSON();
        delete savedCliente.usuario.password;
        res.json(savedCliente);
        res.end();
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getCliente,
    getAllClientes,
    postCliente
}

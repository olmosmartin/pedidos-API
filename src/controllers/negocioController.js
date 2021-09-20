const Negocio = require('../models/Negocio');
const Producto = require('../models/Producto');
const Direccion = require('../models/Direccion');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const getNegocio = async (req, res) => {
    try{
        const negocios = await Negocio.findById(req.params.negocioId).populate('usuario').populate('pedidos');
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const getAllNegocios = async (req, res) => {
    try{
        const negocios = await Negocio.find({
            ...req.query.ciudad ? { 'direccion.ciudad': req.query.ciudad } : {}
        }).populate('usuario');
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postNegocio = async (req, res) => {
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
            role: 'NEGOCIO'
        });
        await usuario.save();

        const direccion = new Direccion({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        });

        const negocio = new Negocio({
            usuario: usuario,
            direccion: direccion,
            productos: [],
            imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
        });

        var savedNegocio = await negocio.save();
        savedNegocio = savedNegocio.toJSON();
        delete savedNegocio.usuario.password;
        res.json(savedNegocio);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const updateNegocio = async (req, res) => {
    try{
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(negocio._id != req.params.negocioId) return res.status(401).send('Access Denied');

        const direccion = new Direccion({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        });

        const updatedNegocio = await Negocio.updateOne(
            { usuario: req.params.negocioId }, 
            { $set: { 
                    direccion: direccion,
                    imagen: 'data:' + req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
                } 
            }
        );
        res.json(updatedNegocio);
        res.end();
    } catch(err){
        res.status(400).send(err.message);
    }
}

const postProducto = async (req, res) => {
    try{
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(negocio._id != req.params.negocioId) return res.status(401).send('Access Denied');

        const producto = new Producto({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: 'data:' + req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64"),
            precio: req.body.precio
        });

        const updatedNegocio = await Negocio.updateOne(
            { usuario: req.params.negocioId },
            { $push: {productos: producto} }
        );
        res.json(updatedNegocio);
        res.end();
    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getNegocio, 
    getAllNegocios,
    postNegocio,
    updateNegocio,
    postProducto
}
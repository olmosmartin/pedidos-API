const Negocio = require('../models/Negocio');
const Producto = require('../models/Producto');
const Direccion = require('../models/Direccion');

const getNegocio = async (req, res) => {
    try{
        const negocios = await Negocio.findById(req.params.negocioId);
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
        });
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postNegocio = async (req, res) => {
    try{
        const direccion = new Direccion({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        });

        const negocio = new Negocio({
            nombre: req.body.nombre,
            email: req.body.email,
            telefono: req.body.telefono,
            direccion: direccion,
            productos: [],
            imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
        });

        const savedNegocio = await negocio.save();
        res.json(savedNegocio);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const updateNegocio = async (req, res) => {
    try{
        const direccion = new Direccion({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        });

        const updatedNegocio = await Negocio.updateOne(
            { _id: req.params.negocioId }, 
            { $set: { 
                    nombre: req.body.nombre,
                    email: req.body.email,
                    telefono: req.body.telefono,
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
        const producto = new Producto({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: 'data:' + req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64"),
            precio: req.body.precio
        });

        const updatedNegocio = await Negocio.updateOne(
            { _id: req.params.negocioId },
            { $push: {productos: producto} }
        );
        res.json(updatedNegocio);
        res.end();
    } catch(err) {
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
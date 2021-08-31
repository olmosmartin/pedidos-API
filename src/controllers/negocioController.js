const Negocio = require('../models/Negocio');
const Producto = require('../models/Producto');

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
        const negocios = await Negocio.find();
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postNegocio = async (req, res) => {
    try{
        const negocio = new Negocio({
            nombre: req.body.nombre,
            email: req.body.email,
            telefono: req.body.telefono,
            productos: [],
            sucursales: [],
            imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
        });

        const savedNegocio = await negocio.save();
        res.json(savedNegocio);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const patchNegocio = async (req, res) => {
    try{
        const updatedNegocio = await Negocio.updateOne(
            { _id: req.params.negocioId }, 
            { $set: { 
                    nombre: req.body.nombre,
                    email: req.body.email,
                    telefono: req.body.telefono,
                    imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
                } 
            }
        );
        res.json(updatedNegocio);
        res.end();
    } catch(err){
        res.status(400).send(err);
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
    patchNegocio,
    postProducto
}
const Producto = require('../models/Producto');

const getProducto = async (req, res) => {
    try{
        const productos = await Producto.findById(req.params.productoId);
        res.json(productos);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const getAllProductos = async (req, res) => {
    try{
        const productos = await Producto.find();
        res.json(productos);
        res.end();
    } catch(err) {
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

        const savedProducto = await producto.save();
        res.json(savedProducto);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

module.exports = {
    getProducto, 
    getAllProductos,
    postProducto
}
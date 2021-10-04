const Producto = require('../models/Producto');
const Negocio = require('../models/Negocio');

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
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(negocio._id != req.params.negocioId) return res.status(401).send('Access Denied');

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
        console.log(err);
        res.status(400).send(err);
    }
}

const updateProducto = async (req, res) => {
    try{
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(negocio._id != req.params.negocioId) return res.status(401).send('Access Denied');

        const updatedNegocio = await Negocio.updateOne(
            { 
                _id: req.params.negocioId, 
                'productos._id': req.params.productoId 
            }, 
            { $set: { 
                    'productos.$.nombre': req.body.nombre,
                    'productos.$.descripcion': req.body.descripcion,
                    'productos.$.imagen': 'data:' + req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64"),
                    'productos.$.precio': req.body.precio
                } 
            }
        );

        res.json(updatedNegocio);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

const deleteProducto = async (req, res) => {
    try{
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(negocio._id != req.params.negocioId) return res.status(401).send('Access Denied');

        const updatedNegocio = await Negocio.updateOne(
            { _id: req.params.negocioId },
            { $pull: 
                { productos: { _id: req.params.productoId } }
            }
        );
        res.json(updatedNegocio);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getProducto, 
    getAllProductos,
    postProducto,
    updateProducto,
    deleteProducto
}
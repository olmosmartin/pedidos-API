const Producto = require('../models/Producto');
const Negocio = require('../models/Negocio');

const getProducto = async (req, res) => {
    try{
        const query = await Negocio.find({
                _id: req.params.negocioId,
                'productos._id': req.params.productoId
            }, { 
                _id:0, 
                "productos.$":1
            });

        const producto = query[0].productos[0];
        res.json(producto);
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
            precio: req.body.precio,
            ...req.body.tipo_comida ? { tipo_comida: req.body.tipo_comida } : {}
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
            {   $set: { 
                    'productos.$.nombre': req.body.nombre,
                    'productos.$.descripcion': req.body.descripcion,
                    ...req.file ? {'productos.$.imagen': 'data:' + req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")} : {},
                    'productos.$.precio': req.body.precio,
                    ...req.body.descuento ? {'productos.$.descuento': req.body.descuento} : {},
                    ...req.body.tipo_comida ? { 'productos.$.tipo_comida': req.body.tipo_comida } : {}
                },
                $unset: {
                    ...req.body.descuento ? {} : {'productos.$.descuento': 1}
                }
            },
            { runValidators: true }
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
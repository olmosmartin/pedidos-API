const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Negocio = require('../models/Negocio');

const getPedido = async (req, res) => {
    try{
        const pedidos = await Pedido.findById(req.params.pedidoId)
            .populate('cliente')
            .populate('negocio')
            .populate('repartidor');
        
        res.json(pedidos);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postPedido = async (req, res) => {
    try{
        const cliente = await Cliente.findOne({
            usuario: req.user._id
        });
        if(!cliente) return res.status(400).send('El cliente solicitado no fue encontrado');

        const negocio = await Negocio.findById(req.body.negocio);
        if(!negocio) return res.status(400).send('El negocio al que se le solicita el pedido no fue encontrado');

        // Cargo los productos usando el valor que tienen guardados en el negocio.
        // La ventaja que tiene guardar los productos embebidos en lugar de referenciarlos    
        // es que aunque cambien a futuro, el historial se mantiene igual.
        var listaProductos = []
        var total = 0;
        req.body.productos.forEach((p) => {
            const producto = negocio.productos.find(producto => producto._id == p.id);
            if(producto){
                listaProductos.push({
                    producto: producto,
                    cantidad: p.cantidad
                });
                total += producto.precio * p.cantidad;
            } else{
                return res.status(400).send('Uno de los productos solicitados no pudo ser encontrado');
            }
        });

        const pedido = new Pedido({
            cliente: cliente._id,
            negocio: req.body.negocio,
            productos: listaProductos,
            total: total,
            estado: 'PENDIENTE'
        });


        // Guardo el pedido y agrego la referencia para el cliente y el negocio
        const savedPedido = await pedido.save();
        await Cliente.updateOne(
            { _id: cliente._id },
            { $push: {pedidos: savedPedido._id}}
        )
        await Negocio.updateOne(
            { _id: negocio._id },
            { $push: {pedidos: savedPedido._id}}
        )

        res.json(savedPedido);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const acceptPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'PENDIENTE') return res.status(400).send('No se puede aceptar el pedido en su estado actual');
        
        const negocio = await Negocio.findOne({
            usuario: req.user._id
        });
        if(!negocio._id.equals(pedido.negocio)) return res.status(400).send('No tiene el permiso para realizar esta accion');

        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: {estado: 'PREPARANDO'} }
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
}

const rejectPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'PENDIENTE') return res.status(400).send('No se puede rechazar el pedido en su estado actual');
        
        const negocio = await Negocio.findOne({
            usuario: req.user._id
        });
        if(!negocio._id.equals(pedido.negocio)) return res.status(400).send('No tiene el permiso para realizar esta accion');

        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: {estado: 'RECHAZADO'} }
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
}

module.exports = {
    getPedido,
    postPedido,
    acceptPedido,
    rejectPedido
}
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Negocio = require('../models/Negocio');
const Repartidor = require('../models/Repartidor');

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

const getAllPedidos = async (req, res) => {
    try{
        const pedidos = await Pedido.find({
            ...req.query.estado ? { estado: req.query.estado } : {}
        })
        .populate('cliente')
        .populate({
            path: 'negocio',
            match: { 
                ...req.query.ciudad ? { 'direccion.ciudad': req.query.ciudad } : {}
            }
        })
        .populate('repartidor');
        const pedidosFiltrados = pedidos.filter((pedido) => { return pedido.negocio });

        res.json(pedidosFiltrados);
        res.end();
    } catch(err){
        console.error(err);
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
            estado: 'PENDIENTE',
            medio_de_pago: req.body.medio_de_pago
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

const aceptarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) 
            return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'PENDIENTE') 
            return res.status(400).send('No se puede aceptar el pedido en su estado actual');
        
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(!negocio._id.equals(pedido.negocio)) 
            return res.status(400).send('No tiene el permiso para realizar esta accion');

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

const rechazarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) 
            return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'PENDIENTE') 
            return res.status(400).send('No se puede rechazar el pedido en su estado actual');
        
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(!negocio._id.equals(pedido.negocio)) 
            return res.status(400).send('No tiene el permiso para realizar esta accion');

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

const listoPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) 
            return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'PREPARANDO') 
            return res.status(400).send('No se puede marcar listo el pedido en su estado actual');
        
        const negocio = await Negocio.findOne({ usuario: req.user._id });
        if(!negocio._id.equals(pedido.negocio)) 
            return res.status(400).send('No tiene el permiso para realizar esta accion');

        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: {estado: 'LISTO'} }
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

const encaminarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) 
            return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'LISTO') 
            return res.status(400).send('No se puede marcar en camino el pedido en su estado actual');
        
        const repartidor = await Repartidor.findOne({ usuario: req.user._id });
        if(!repartidor)
            return res.status(400).send('No tiene el permiso para realizar esta accion');
        // Agrego la referencia del pedido al repartidor
        await Repartidor.updateOne(
            { _id: repartidor._id },
            { $push: {pedidos: pedido._id}}
        )
    
        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: {
                repartidor: repartidor._id,
                estado: 'EN_CAMINO'
            } }
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

const finalizarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId);
        if(!pedido) 
            return res.status(400).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.estado !== 'EN_CAMINO') 
            return res.status(400).send('No se puede finalizar el pedido en su estado actual');
        
        const repartidor = await Repartidor.findOne({ usuario: req.user._id });
        if(!repartidor._id.equals(pedido.repartidor))
            return res.status(400).send('No tiene el permiso para realizar esta accion');

        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: { estado: 'FINALIZADO' } }
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

const puntuarPedido = async (req, res) => {
    try{
        const pedido = await Pedido.findById(req.params.pedidoId).populate('negocio');
        if(!pedido) 
            return res.status(404).send('El pedido solicitado no pudo ser encontrado');

        if(pedido.review.puntuacion)
            return res.status(400).send('El pedido ya fue puntuado, no puede hacerlo nuevamente');
        
        if(pedido.estado !== 'FINALIZADO') 
            return res.status(400).send('No se puede puntuar un pedido no finalizado');

        const cliente = await Cliente.findOne({ usuario: req.user._id });
        if(!cliente._id.equals(pedido.cliente))
            return res.status(403).send('No tiene el permiso para realizar esta accion');
    
        const updatedPedido = await Pedido.updateOne(
            { _id: req.params.pedidoId },
            { $set: { 
                review: {
                    puntuacion: req.body.puntuacion,
                    ...req.body.comentario ? { comentario: req.body.comentario } : {}
                }
            } },
            { runValidators: true }
        );
        await Negocio.updateOne(
            { _id: pedido.negocio._id },
            { 
                $inc: { 
                    puntuacionCount: 1,
                    puntuacionTotal: req.body.puntuacion
                },
                $set: {
                    puntuacionAvg: ((pedido.negocio.puntuacionTotal || 0) + req.body.puntuacion)/((pedido.negocio.puntuacionCount || 0) + 1)
                }
            },
        );
        res.json(updatedPedido);
        res.end();
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getPedido,
    getAllPedidos,
    postPedido,
    aceptarPedido,
    rechazarPedido,
    listoPedido,
    encaminarPedido,
    finalizarPedido,
    puntuarPedido
}
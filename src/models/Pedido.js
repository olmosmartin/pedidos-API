const mongoose = require('mongoose');
const ProductoSchema = require('./Producto').schema;

const PedidoSchema = mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        required: true
    },
    repartidor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repartidor'
    },
    productos: [{
        producto: ProductoSchema,
        cantidad: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        required: true,
        // En pedidosYa no se puede cancelar el pedido una vez que lo agarro el repartidor
        enum: ['PENDIENTE', 'RECHAZADO', 'PREPARANDO', 'LISTO', 'CANCELADO', 'EN_CAMINO', 'FINALIZADO']
    },
    review: {
        puntuacion: {
            type: Number,
            min: 1,
            max: 5
        },
        comentario: {
            type: String
        }
    }, 
    medio_de_pago: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pedido', PedidoSchema);
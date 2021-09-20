const mongoose = require('mongoose');

const RepartidorSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    pedidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    }],
    puntuacion: {
        type: Number,
        min: 1,
        max: 5
    }
});

module.exports = mongoose.model('Repartidor', RepartidorSchema);
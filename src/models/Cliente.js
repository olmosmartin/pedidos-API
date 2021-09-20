const mongoose = require('mongoose');
const UsuarioSchema = require('./Usuario').schema;
const DireccionSchema = require('./Direccion').schema;
const PedidoSchema = require('./Pedido').schema;

const ClienteSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    direccion: {
        type: DireccionSchema,
        required: true
    },
    pedidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    }]
});

module.exports = mongoose.model('Cliente', ClienteSchema);
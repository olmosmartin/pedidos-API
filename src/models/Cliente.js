const mongoose = require('mongoose');
const UsuarioSchema = require('./Usuario').schema;
const DireccionSchema = require('./Direccion').schema;

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
    pedido_activo: {
        type: String
    },
    historial_pedidos: {
        type: String
    }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
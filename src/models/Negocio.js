const mongoose = require('mongoose');
const ProductoSchema = require('./Producto').schema;
const DireccionSchema = require('./Direccion').schema;
const UsuarioSchema = require('./Usuario').schema;

const NegocioSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    direccion: {
        type: DireccionSchema,
        required: true
    },
    productos: [ProductoSchema]
});

module.exports = mongoose.model('Negocio', NegocioSchema);
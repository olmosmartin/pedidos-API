const mongoose = require('mongoose');
const TipoComidaSchema = require('./TipoComida');

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number,
        min: 1,
        max: 100
    },
    tipo_comida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoComida'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', ProductoSchema);
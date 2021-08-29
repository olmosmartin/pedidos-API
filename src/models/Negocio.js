const mongoose = require('mongoose');
const productoSchema = require('./Producto').schema

const NegocioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    imagen: {
        data: Buffer,
        contentType: String
    },
    productos: [productoSchema]
});

module.exports = mongoose.model('Negocio', NegocioSchema);
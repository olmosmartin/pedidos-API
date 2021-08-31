const mongoose = require('mongoose');
const productoSchema = require('./Producto').schema;
const sucursalSchema = require('./Sucursal').schema;

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
        type: String,
        required: true
    },
    productos: [productoSchema],
    sucursales: [sucursalSchema]
});

module.exports = mongoose.model('Negocio', NegocioSchema);
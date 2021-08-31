const mongoose = require('mongoose');
const direccionSchema = require('./Direccion');

const SucursalSchema = mongoose.Schema({
    direccion: {
        type: direccionSchema,
        required: true
    },
    puntuacionTotal: {
        type: Number,
        required: true
    },
    puntuacionCant: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Sucursal', SucursalSchema);
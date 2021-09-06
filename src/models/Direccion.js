const mongoose = require('mongoose');

const DireccionSchema = mongoose.Schema({
    latitud: {
        type: Number,
        required: true
    },
    longitud: {
        type: Number,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    calle: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Direccion', DireccionSchema);
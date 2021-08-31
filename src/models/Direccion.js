const mongoose = require('mongoose');

const DireccionSchema = mongoose.Schema({
    localidad: {
        type: String,
        required: true
    },
    calle: {
        type: String,
        required: true
    },
    nro: {
        type: Number,
        required: true
    }
});
const mongoose = require('mongoose');

const TipoComidaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TipoComida', TipoComidaSchema);
const mongoose = require('mongoose');

//Todos los usuarios tienen este esquema embebido para unificar la parte del login
const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024,
        select: false
    },
    telefono: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['CLIENTE', 'NEGOCIO', 'REPARTIDOR', 'ADMIN']
    },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
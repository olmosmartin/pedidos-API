const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:usuarioId', usuarioController.getUsuario);
router.post('/login', usuarioController.login);

module.exports = router;
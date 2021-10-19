const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authorize = require('../middlewares/roleAccess');

router.get('/:usuarioId', usuarioController.getUsuario);
router.post('/login', usuarioController.login);
router.post('/password_reset', usuarioController.passwordReset);
router.post('/password_change', authorize(['CLIENTE', 'NEGOCIO', 'REPARTIDOR', 'ADMIN']) , usuarioController.passwordChange);

module.exports = router;
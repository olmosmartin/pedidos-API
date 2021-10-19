const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:usuarioId', usuarioController.getUsuario);
router.post('/login', usuarioController.login);
router.post('/password_reset', usuarioController.passwordReset);
router.post('/:usuarioId/password_change', usuarioController.passwordChange);

module.exports = router;
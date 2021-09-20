const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authorize = require('../middlewares/roleAccess');

router.get('/:pedidoId', pedidoController.getPedido);
router.post('/', authorize(['CLIENTE']), pedidoController.postPedido);
router.put('/:pedidoId/aceptar', authorize(['NEGOCIO']), pedidoController.acceptPedido);
router.put('/:pedidoId/rechazar', authorize(['NEGOCIO']), pedidoController.rejectPedido);

module.exports = router;
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authorize = require('../middlewares/roleAccess');

router.get('/:pedidoId', pedidoController.getPedido);
router.get('/', pedidoController.getAllPedidos);
router.post('/', authorize(['CLIENTE']), pedidoController.postPedido);

// Cambio de estado
router.put('/:pedidoId/aceptar', authorize(['NEGOCIO']), pedidoController.aceptarPedido);
router.put('/:pedidoId/rechazar', authorize(['NEGOCIO']), pedidoController.rechazarPedido);
router.put('/:pedidoId/listo', authorize(['NEGOCIO']), pedidoController.listoPedido);
router.put('/:pedidoId/encaminar', authorize(['REPARTIDOR']), pedidoController.encaminarPedido);
router.put('/:pedidoId/finalizar', authorize(['REPARTIDOR']), pedidoController.finalizarPedido);
router.post('/:pedidoId/puntuar', authorize(['CLIENTE']), pedidoController.puntuarPedido);

module.exports = router;
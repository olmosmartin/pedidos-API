const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.get('/:clienteId', clienteController.getCliente);
router.post('/', clienteController.postCliente);

module.exports = router;
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authorize = require('../middlewares/roleAccess');

router.get('/', authorize(['ADMIN']), clienteController.getAllClientes);
router.get('/:clienteId', clienteController.getCliente);
router.post('/', clienteController.postCliente);

module.exports = router;
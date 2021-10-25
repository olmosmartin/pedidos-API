const express = require('express');
const router = express.Router();
const tipoComidaController = require('../controllers/tipoComidaController');

router.get('/', tipoComidaController.getAllTipoComidas);
router.post('/', tipoComidaController.postTipoComida);

module.exports = router;
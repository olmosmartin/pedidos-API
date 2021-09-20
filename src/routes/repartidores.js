const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/repartidorController');

router.get('/:repartidorId', repartidorController.getRepartidor);
router.post('/', repartidorController.postRepartidor);

module.exports = router;
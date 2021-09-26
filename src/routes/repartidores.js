const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/repartidorController');

router.get('/:repartidorId', repartidorController.getRepartidor);
router.get('/', repartidorController.getAllRepartidor);
router.post('/', repartidorController.postRepartidor);

module.exports = router;
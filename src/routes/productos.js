const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const multerUpload = require('../middlewares/multerConfig');

router.get('/', productoController.getAllProductos);
router.get('/:productoId', productoController.getProducto);
router.post('/', multerUpload, productoController.postProducto);

module.exports = router;
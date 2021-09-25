const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams permite usar parametros anteriores a esta ruta (negocioId)
const productoController = require('../controllers/productoController');
const multerUpload = require('../middlewares/multerConfig');
const authorize = require('../middlewares/roleAccess');

router.get('/', productoController.getAllProductos);
router.get('/:productoId', productoController.getProducto);
router.post('/', authorize(['NEGOCIO']), multerUpload, productoController.postProducto);
router.delete('/:productoId', authorize(['NEGOCIO']), productoController.deleteProducto);

module.exports = router;
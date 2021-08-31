const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');
const multerUpload = require('../middlewares/multerConfig');

router.get('/', negocioController.getAllNegocios);
router.get('/:negocioId', negocioController.getNegocio);
router.post('/', multerUpload, negocioController.postNegocio);
router.post('/:negocioId/productos', multerUpload, negocioController.postProducto);
router.patch('/:negocioId', negocioController.patchNegocio);

module.exports = router;
const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');
const multerUpload = require('../middlewares/multerConfig');
const authorize = require('../middlewares/roleAccess');

router.get('/', negocioController.getAllNegocios);
router.get('/:negocioId', negocioController.getNegocio);
router.post('/', multerUpload, negocioController.postNegocio);
router.post('/:negocioId/productos', authorize(['NEGOCIO']), multerUpload, negocioController.postProducto);
router.put('/:negocioId', authorize(['NEGOCIO']), multerUpload, negocioController.updateNegocio);

module.exports = router;
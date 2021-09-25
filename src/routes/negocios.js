const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');
const multerUpload = require('../middlewares/multerConfig');
const authorize = require('../middlewares/roleAccess');
const productosRoute = require('./productos');

router.use('/:negocioId/productos', productosRoute);

router.get('/', negocioController.getAllNegocios);
router.get('/:negocioId', negocioController.getNegocio);
router.post('/', multerUpload, negocioController.postNegocio);
router.put('/:negocioId', authorize(['NEGOCIO']), multerUpload, negocioController.updateNegocio);

module.exports = router;
const express = require('express');
const router = express.Router();
const holaMundoController = require("../controllers/holaMundoController");



router.get('/holamundo', holaMundoController.getHolaMundo)

router.get('/otro', holaMundoController.getOtro)


module.exports= router;
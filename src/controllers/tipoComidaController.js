const TipoComida = require('../models/TipoComida');

const getAllTipoComidas = async (req, res) => {
    try{
        const tipoDeComidas = await TipoComida.find();
        res.json(tipoDeComidas);
        res.end();
    } catch(err){
        console.error(err);
    }
}

const postTipoComida = async (req, res) => {
    try{
        const tipoDeComida = new TipoComida({
            nombre: req.body.nombre
        });
        const savedTipo = await tipoDeComida.save();
        res.json(savedTipo);
        res.end();
    } catch(err){
        console.error(err);
    }
}

module.exports = {
    getAllTipoComidas,
    postTipoComida
}
const Negocio = require('../models/Negocio');

const getNegocio = async (req, res) => {
    try{
        const negocios = await Negocio.findById(req.params.negocioId);
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const getAllNegocios = async (req, res) => {
    try{
        const negocios = await Negocio.find();
        res.json(negocios);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const postNegocio = async (req, res) => {
    try{
        const negocio = new Negocio({
            nombre: req.body.nombre,
            email: req.body.email,
            telefono: req.body.telefono,
            productos: req.body.productos,
            sucursales: req.body.sucursales,
            imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
        });

        const savedNegocio = await negocio.save();
        res.json(savedNegocio);
        res.end();
    } catch(err) {
        res.status(400).send(err);
    }
}

const patchNegocio = async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $set: { 
                    telefono: req.body.telefono,
                    productos: req.body.productos,
                    sucursales: req.body.sucursales,
                    imagen: 'data:' +req.file.mimetype + ';base64,'+ req.file.buffer.toString("base64")
                } 
            }
        )
        res.json(updatedPost)
        res.end()
    } catch(err){
        res.status(400).send(err)
    }
}

module.exports = {
    getNegocio, 
    getAllNegocios,
    postNegocio,
    patchNegocio
}
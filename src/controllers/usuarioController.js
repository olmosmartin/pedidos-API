const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');
const Cliente = require('../models/Cliente');
const Repartidor = require('../models/Repartidor');
const sendEmail = require('../middlewares/sendEmail');

const login = async (req, res) => {
    try{
        //Por default no se incluye el password en las queries, hay que hacer un select.
        const user = await Usuario.findOne({ email: req.body.email }).select('+password');
        if(!user) return res.status(400).send('No existe un usuario con ese email');

        bcrypt.compare(req.body.password, user.password, async (err, isValid) => {
            if(isValid){
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);

                // Cargo el id segun el tipo de cliente, esto codigo es horrible
                var id = '';
                const negocio = await Negocio.findOne({ usuario: user._id });
                const cliente = await Cliente.findOne({ usuario: user._id });
                const repartidor = await Repartidor.findOne({ usuario: user._id });
                if(negocio) id = negocio._id;
                else if(cliente) id = cliente._id;
                else if(repartidor) id = repartidor._id;
                
                res.send({'auth_token': token, 'role': user.role, 'id': id});
            }
            else{
                res.status(400).send("La contraseña ingresada es incorrecta");
            }
        })
    }
    catch(err){
        res.status(400).send(err);
    } 
}

const getUsuario = async (req, res) => {
    try{
        const user = await Usuario.findById(req.params.usuarioId);
        if(user.role == 'NEGOCIO'){
            const negocio = await Negocio.find({
                usuario: user._id
            }).populate('usuario');
            res.json(negocio);
        } else{
            res.json(user);
        }
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
}

const passwordReset = async (req, res) => {
    try{
        const user = await Usuario.findOne({ email: req.body.email });
        if(!user) {
            return res.status(400).send('No existe un usuario con ese email');
        }

        const newToken = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        const link = `grupocpediloya.herokuapp.com/passwordReset?token=${newToken}`;
        const email = await sendEmail(user.email, 'Password Reset', { name: user.nombre, link: link }, 'templates/passwordReset.hbs');
        if(!email){
            return res.status(500).send('Hubo un error al enviar el email, intentalo mas tarde.');
        }

        res.status(200).send("Ya se envio el link para resetear contraseña, chequea tu mail.");
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

const passwordChange = async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(req.body.password, salt);
        await Usuario.updateOne(
            { _id: req.user._id },
            { $set: { password: hash } }
        );

        res.status(200).send("Se actualizo la contraseña correctamente.");
    } catch(err){
        console.error(err);
        res.status(400).send(err);
    }
}

module.exports = { 
    login, 
    getUsuario, 
    passwordReset,
    passwordChange
};
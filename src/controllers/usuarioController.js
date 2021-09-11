const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const login = async (req, res) => {
    try{
        //Por default no se incluye el password en las queries, hay que hacer un select.
        const user = await Usuario.findOne({ email: req.body.email }).select('+password');
        if(!user) return res.status(400).send('No existe un usuario con ese email');

        bcrypt.compare(req.body.password, user.password, (err, isValid) => {
            if(isValid){
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET);
                res.send({'auth_token': token, 'role': user.role, 'id': user._id});
            }
            else{
                res.status(400).send("La contraseña ingresada es incorrecta");
            }
        })
    }
    catch(err){
        res.status(500).send(err);
    } 
}

module.exports = { login };
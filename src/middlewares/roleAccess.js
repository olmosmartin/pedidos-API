const jwt = require('jsonwebtoken');

const authorize = (roles) => (req, res, next) => {
    try{
        //Chequeo si el header con el token esta
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Token missing');

        //Compruebo si es un token valido
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!req.user){
            return res.status(401).send('Session expired');
        }

        //Chequeo si el rol esta en la lista de permitidos
        const allowed = roles.indexOf(req.user.role);
        if(allowed > -1){
            return next();
        }
        else{
            return res.status(401).send('Access Denied');
        }
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = authorize;
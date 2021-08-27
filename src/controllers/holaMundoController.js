
const getHolaMundo = (req, res) => {
    res.send("Hola Mundo")
}

const getOtro = (req, res) => {
    res.send("Otro")
}

module.exports = {
    getHolaMundo,
    getOtro
}
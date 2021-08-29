const multer = require('multer');

const multerUpload = multer({ 
    storage: multer.memoryStorage({
        filename: (req, file, cb) => {
            cb(null, file.filename + '-' + Date.now())
        }
    }),
    limits: {
        fileSize: 1024 * 1024
    }
}).single('file');

module.exports = multerUpload;
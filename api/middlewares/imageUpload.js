const multer = require('multer');
const ImageKit = require("imagekit");


const imagekit = new ImageKit({
    publicKey : process.env.PUBLICKEY,
    privateKey :process.env.PRIVATEKEY,
    urlEndpoint : process.env.URL_ENDPOINT
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        const error = new Error("Invalid file")
        error.message = "The file you uploaded is not a valid image, we support only (jpeg, jpg, png) types"
        error.code = 'INVALID_FILE_TYPE'
        error.field= file.fieldname
        cb(error,false)
    }
}

module.exports=(value)=> (req, res, next) =>{
    const uploadFiles = multer({storage:multer.memoryStorage(),limits:{fileSize:1572864},fileFilter:fileFilter}).single(value);
    uploadFiles( req, res, err => {
        if (err) {
            let messageError = ''
            if(err.code === "LIMIT_FILE_SIZE"){
                messageError = "Image too large, you can only upload images up to 1.5 MB"
            }
            if(err.code === "INVALID_FILE_TYPE"){
                messageError = err.message
            }
            
            return res.status(413).json({
                message:messageError
            })
            
        }

        if(!req.file){
            req.body.image = null 
            next()
        }

        const ImageFolder = req.file.fieldname.replace('image','')
        imagekit.upload({
            file : req.file.buffer, //required
            fileName : req.file.originalname, //required
            folder:ImageFolder,
        }, function(error, result) {
            if(error) console.log(error);
            const image = {
                fileId:result.fileId,
                name:result.name,
                filePath:result.filePath,
                url:result.url,
                height:result.height,
                width:result.width,
                thumbnailUrl:result.thumbnailUrl
            }
            req.body.image = image
            next();
        });
        
    });
}
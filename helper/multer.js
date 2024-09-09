const path = require('path');
const multer = require('multer');
const sharp = require('sharp')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique timestamp and random number
        const fileExtension = path.extname(file.originalname); // Get the file extension from the original file name
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Format the final file name
    }
    
})


const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 10 * 1024 * 1024, 
    }
 });

module.exports = upload;

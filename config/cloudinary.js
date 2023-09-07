const cloudinary = require('cloudinary').v2
const {CloudinaryStorage}  = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.COLUDINARY_CLOUD_NAME,
    api_key: process.env.COLUDINARY_API_KEY,
    api_secret : process.env.COLUDINARY_API_SECRET_KEY,
});

//Isntance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats : ['jpeg' , 'jpg' , 'png'],
    params:{
        folder:'blog-api',
        transformation:[{width:500 , height:500 , crop:"limit"}]
    }
})


module.exports = storage
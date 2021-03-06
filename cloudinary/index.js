const cloudinary=require("cloudinary").v2;
require('dotenv').config();
const {CloudinaryStorage}=require('multer-storage-cloudinary')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'resume',
    allowedFormats:['jpeg','png','jpg','pdf','doc','docx']
    }
})
module.exports={
    cloudinary,
    storage
}
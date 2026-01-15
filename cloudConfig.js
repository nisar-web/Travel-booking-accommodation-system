const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary')
//login in backed app to cloudinary using credentials
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage= new CloudinaryStorage({
    cloudinary:cloudinary,// logged in name of m cloudinary account which cloudinary
    params:{
        folder:"wanderlust_DEV",//cloudinary folder
        allowerdFormats:["png","jpg","jpeg"],
    },
})

module.exports={
    cloudinary,// delete images how ? im not clear
    
    storage,// exports so others hepls to  ulpoad or stores image
}
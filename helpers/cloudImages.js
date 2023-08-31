const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_ID,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUD_SECRET
});

/* const uploadCloudinary = async (file) => {
  console.log( file, 'fail', typeof file)
    const formData = new FormData();
    formData.append('file', fileBuffer, { filename: originalFilename });
    formData.append('upload_preset', `${process.env.CLOUD_PASS}`)
    const options = {
      method: 'POST',
      body: formData
    }
    console.log(file)
    console.log(formData,'formdata')
  
    try {
      const petition = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_ID}/image/upload`, options)
      const json = await petition.json()
      console.log(json,'jotason')
  
      return json.url
    } catch (error) {
      return 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
    }
  }

  module.exports = {
    uploadCloudinary
  } */

  const uploadCloudinary = async (file) => {

    try {
      await cloudinary.uploader.upload(file, (error, result) => {
        if (error) {
            console.log(error)
            return 'Error al subir la imagen'
        } else {
            return result.url
        }
    });
    } catch (error) {
      console.log(error)
    }

 
};

 /*    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.CLOUD_PASS);
    
    const options = {
      method: 'POST',
      body: formData,
    };
  
    try {
      const petition = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_ID}/image/upload`, options);
      const json = await petition.json();
      console.log(json)
      return json.url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg';
    } */
  

  module.exports = {
    uploadCloudinary
  }
  
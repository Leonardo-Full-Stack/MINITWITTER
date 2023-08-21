const { uploadCloudinary } = require("../helpers/cloudImages");



const uploadEntry2 = (req, res) => {
    console.log(req.body, req.file)
  const upload = uploadCloudinary(req.file)
};

module.exports = {
    uploadEntry2
};
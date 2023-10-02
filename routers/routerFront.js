const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser')
const {getIndex, checkLogin, logOut, signup, uploadSignup, editMyProfile} = require('../controllers/loginControllers')
const {
  showEntries, 
  postEntry, 
  uploadEntry, 
  myEntries, 
  getSearch,
  editEntry,
  updateEntry, 
  viewOne, 
  showLogin,
  uploadReply,
  showCategories,
  showMyProfile,
  showPublicProfile,
  showMyFeed,
  editMyProfile2
} = require('../controllers/frontControllers')

const {uploadEntry2} = require('../controllers/proofs')
const {validarJwt,validarJwtAdmin} = require('../middleware/validarJwt')

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/media/uploads')
    },
    filename: function (req, file, cb) {
      cb(null,  `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })
const cpupload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }])

router.get('/', showEntries)
router.get('/login', showLogin)
router.get('/signup', signup)
router.get('/mifeed', showMyFeed)
router.get('/editmyprofile', editMyProfile)
router.post('/editmyprofile2',cpupload, editMyProfile2)
router.get('/categories/:category', showCategories)
router.post('/signup',upload.single('avatar'), uploadSignup)
router.post('/log', checkLogin)
router.get('/search', getSearch)
router.post('/search', getSearch)
router.get('/entries', showEntries)
router.get('/viewOne/:id', viewOne)
router.get('/profile/:name', showPublicProfile)

//rutas protegidas
router.get('/myEntries/',validarJwt, myEntries)
router.get('/post',validarJwt, postEntry)
router.get('/myprofile', showMyProfile)
router.post('/post',[validarJwt,upload.single('entryImage')], uploadEntry)
router.post('/uploadreply', uploadReply)
router.get('/edit/:indexEntry',validarJwt, editEntry)
router.post('/edit/',[validarJwt,upload.single('entryImage')], updateEntry)
router.get('/logout',validarJwt, logOut)



module.exports = router
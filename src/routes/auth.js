const router = require('express').Router();

const authController = require('../controller/AuthController');
const fileUploader =require('../config/cloudinary.config')
router.post('/login',authController.handleLogin);
router.post('/singin',fileUploader.single('image'),authController.signin);
router.get('/verify-account',authController.verifyUser)
router.post('/refreshtoken', authController.refreshAccessToken)
module.exports = router

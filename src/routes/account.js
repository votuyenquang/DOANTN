const express= require('express')
const router=express.Router()
const authJwt = require('../middlewares/authJwt');
const AccountController=require('../controller/AccountController')
const fileUploader =require('../config/cloudinary.config')



router.post('/resetpw',AccountController.ResetPassword);
router.post('/password/:id',authJwt.authenToken, authJwt.isAdminOrUser,AccountController.changePassword);//
router.get('/',authJwt.authenToken,authJwt.isAdmin,AccountController.getAllAcount)//authJwt.authenToken,authJwt.isAdmin,
router.post('/profile/:id',authJwt.authenToken,fileUploader.single('image'),AccountController.UpdateAccount)//user,admin
router.delete('/:id',authJwt.authenToken,authJwt.isAdmin,AccountController.DeleteAccount)
router.get('/:id',authJwt.authenToken, AccountController.getaccountById);//
router.get('/enable/:id',authJwt.authenToken,authJwt.isAdmin)
router.get('/enable/:id',authJwt.authenToken,authJwt.isAdmin)
router.post('/create',authJwt.authenToken,authJwt.isAdmin,fileUploader.single('image'),AccountController.createAccount)
router.post('/createAccCenter',authJwt.authenToken,authJwt.isAdmin,fileUploader.single('image'),AccountController.createAccountCenter)

router.post('/update/:id',authJwt.authenToken,authJwt.isAdmin,fileUploader.single('image'),AccountController.UpdateAccounttoadmin)
module.exports = router

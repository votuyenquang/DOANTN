const express= require('express')
const router=express.Router()
const authJwt = require('../middlewares/authJwt');
const fileUploader =require('../config/cloudinary.config')
const proofsController=require('../controller/proofsController')
router.get('/:id',authJwt.authenToken,proofsController.getlistproofsbyid);
router.post('/:id',authJwt.authenToken,fileUploader.single('image'),proofsController.createproofs);
router.delete('/:id',authJwt.authenToken,proofsController.Deleteproofs);




module.exports = router

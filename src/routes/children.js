const express= require('express')
const router=express.Router();
const authJwt = require('../middlewares/authJwt');
const ChildrenController=require('../controller/ChildrenController')
const fileUploader = require('../config/cloudinary.config');
const children = require('../models/children');
router.get('/',ChildrenController.getallChildren);
router.delete('/:id',authJwt.authenToken,authJwt.isAdminOrUser,ChildrenController.DeleteChildren);
router.get('/center/:id',authJwt.authenToken,ChildrenController.getallChildrenbycenter);
router.get('/:id',authJwt.authenToken, ChildrenController.getChildrenById);
router.post('/create/:id',authJwt.authenToken,authJwt.isAdminOrUser,fileUploader.single('image'),ChildrenController.create);
router.put('/:id',authJwt.authenToken,fileUploader.single('image'),ChildrenController.UpdateChildren)
 
module.exports = router

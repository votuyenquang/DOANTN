const router = require('express').Router();
const authJwt = require('../middlewares/authJwt');
const fileUploader =require('../config/cloudinary.config');

const ActivityController=require('../controller/ActivityController')
router.get('/',ActivityController.getallactivity);
router.delete('/:id',authJwt.authenToken,authJwt.isAdminOrUser,ActivityController.deleteactivity);
router.get('/:id',authJwt.authenToken,ActivityController.getactivitybyid);
router.post('/:id',authJwt.authenToken,authJwt.isAdminOrUser,fileUploader.single('image'),ActivityController.createActivity)
router.post('/update/:id',authJwt.authenToken,authJwt.isAdminOrUser,fileUploader.single('image'),ActivityController.updateActivity)
router.get('/center/:id',authJwt.authenToken,ActivityController.getactivitybycenter);
module.exports = router

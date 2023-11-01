const express= require('express')
const router=express.Router();
const authJwt = require('../middlewares/authJwt');
const DonorController=require('../controller/DonorController')
router.get('/:id',authJwt.authenToken,DonorController.getlistdonorbycenter);
router.post('/',authJwt.authenToken,DonorController.createDonor)

module.exports = router

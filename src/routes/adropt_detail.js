const express= require('express')
const router=express.Router()
const authJwt = require('../middlewares/authJwt');
const adropt_detailController=require('../controller/adropt_detailController')

router.get('/:id',authJwt.authenToken,adropt_detailController.getadropt_detailbyid);
router.get('/acount/:id',authJwt.authenToken,adropt_detailController.getadropt_detailbyacountid);
router.post('/',authJwt.authenToken,adropt_detailController.creatadropt_detail)
router.put('/:id',authJwt.authenToken,adropt_detailController.Updateadropt_detail)


module.exports = router

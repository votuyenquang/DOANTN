const express= require('express')
const router=express.Router()
const authJwt = require('../middlewares/authJwt');
const adropt_requestController=require('../controller/adropt_requestController')
router.get('/:id',authJwt.authenToken,adropt_requestController.getadropt_requesbychildrentid);
router.post('/',authJwt.authenToken,adropt_requestController.creatadropt_request)
router.put('/:id',authJwt.authenToken,adropt_requestController.Updateadropt_request)
router.get('/account/:id',authJwt.authenToken,adropt_requestController.getadropt_requesbydetailltid);
router.get('/center/:id',authJwt.authenToken,adropt_requestController.getadropt_requesbycenterid);
router.delete('/:id',authJwt.authenToken,adropt_requestController.Deleteadropt_reques);

module.exports = router
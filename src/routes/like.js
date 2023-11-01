const router = require('express').Router();
const authJwt = require('../middlewares/authJwt');
const LikeController=require('../controller/LikeController');

router.post('/',authJwt.authenToken,LikeController.like)
router.post('/dislike/',authJwt.authenToken,LikeController.dislike)
router.post('/check/',authJwt.authenToken,LikeController.checklikebyidacount)
module.exports=router
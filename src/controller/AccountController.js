
const AccountService =require('../service/AccountService')
const moment = require('moment');
let ResetPassword = async (req, res) => {
    console.log(req.body.email)
    if (!req.body.email) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhap day du thong tin'
        })
    }
let resData = await AccountService.ResetPassword(req.body)
    if (resData.errCode == 0) {
        return res.status(200).json(resData)
    } else {
        return res.status(400).json(resData)
    }
}
let DeleteAccount =async (req,res)=>{
    console.log('delete')
    let id =req.params.id;
    console.log(id)
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    let resData=await AccountService.deleteAccount(id)
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
   
}
let getAllAcount =async (req,res)=>{
    console.log('ok')
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    console.log(req.params.page)
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 20 : req.query.limit;

    let resData=await AccountService.getAllAcount(key,pageNumber,limit)

    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        account: resData.account,
    })

}
let UpdateAccount= async(req,res)=>{
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }

    console.log( req.body)
    if (req.file) {
        req.body.image = req.file.path;
    } 
    console.log(req.body.image)
///connectfdatabase
    let resData=await AccountService.UpdateAccount(req.params, req.body)
    if(resData.errCode == 2){
        return res.status(404).json({
            errCode:resData.errCode,
            message: resData.errMessage
        })
    } else {
        return res.status(200).json({
            errCode:resData.errCode,
            message: resData.errMessage
        })
    }


}
let changePassword=async(req,res)=>{
    console.log ('thay mk')
    if(!req.body.password || !req.body.newPassword){
        return res.status(400).json({
            erroCode:1,
            message:'nhập đầy đủ thông tin'
        })   
    }
    if(req.body.newPassword.length < 5 || req.body.newPassword.length>15 ){
        return res.status(400).json({
            erroCode:1,
            message:'độ dài mật khẩu phải lớn hơn hoặc bằng 5 ký tự và không quá 15 ký tự'
        })
    }
    let response= await AccountService.changePassword(req.params,req.body)
    if(response.errCode == 4){
        return res.status(401).json(response)
    } else {
        return res.status(200).json(response)
    }

}
let getaccountById= async(req,res)=>{
    let resData = await AccountService.getaccountById(req.params);
    if(resData.errCode == 2){
        return res.status(404).json(resData);
    } else{
        return res.status(200).json(resData);
    }
}
let createACcount =async(req,res)=>{
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    if (req.body.password.length < 5 || req.body.password.length > 15) {
        return res.status(400).json({
            erroCode: 1,
            message: 'độ dài mật khẩu phải lớn hơn hoặc bằng 5 ký tự và không quá 15 ký tự'
        })
    }
    if (!moment(req.body.birthday, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            erroCode: 1,
            message: 'định dạng birthday không đúng. Ví dụ về định dạng đúng : 2022-11-20'
        })
    }

    if (!req.file) {
        if (req.body.gender === '1') {
            req.body.image = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
        } else {
            req.body.image = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
        }
    } else {
        req.body.image = req.file.path;
    }
   
    req.body.active = '1'
    let message = await AccountService.createNewAccount(req.body, 'user');
    console.log(message)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    }
}

let  UpdateAccounttoadmin=async(req,res)=>{
    console.log('admin')
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }
    if ( !req.body.password || !req.body.name || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    if (req.body.password.length < 5 || req.body.password.length > 15) {
        return res.status(400).json({
            erroCode: 1,
            message: 'độ dài mật khẩu phải lớn hơn hoặc bằng 5 ký tự và không quá 15 ký tự'
        })
    }
    if (!moment(req.body.birthday, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            erroCode: 1,
            message: 'định dạng birthday không đúng. Ví dụ về định dạng đúng : 2022-11-20'
        })
    }

    if (!req.file) {
        if (req.body.gender === '1') {
            req.body.image = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
        } else {
            req.body.image = 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
        }
    } else {
        req.body.image = req.file.path;
    }
   if( req.body.role===''){
    req.body.role==0
   }
   let resData = await AccountService.UpdateAccounttoadmin(req.params,req.body);
   if(resData.errCode == 2){
    return res.status(404).json({
        errCode:resData.errCode,
        message: resData.errMessage
    })
} else {
    return res.status(200).json({
        errCode:resData.errCode,
        message: resData.errMessage
    })
}
}
module.exports = {
    ResetPassword:ResetPassword,
    DeleteAccount:DeleteAccount,
    getAllAcount:getAllAcount,
    UpdateAccount:UpdateAccount,
    changePassword:changePassword,
    getaccountById:getaccountById,
    createACcount:createACcount,
    UpdateAccounttoadmin:UpdateAccounttoadmin
    
}
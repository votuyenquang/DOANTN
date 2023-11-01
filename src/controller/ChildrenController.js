const ChildrenService = require('../service/ChildrenService')
const moment = require('moment');
let DeleteChildren = async (req, res) => {
    console.log('delete')
    let id = req.params.id;
    console.log(id)
    if (!id) {
        return res.status(400).json({ message: 'Thiếu tham số id' });
    }
    let resData = await ChildrenService.deleteChildren(id)
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
}
let getChildrenById = async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        
        let children = await ChildrenService.getChildrenByid(id)
        if (children) {
            return res.status(200).json({
                errCode: 0,
                message: children,
            })
        }
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy tre có id này',
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }

}
let getallChildrenbycenter =async (req,res)=>{
    let id = parseInt(req.params.id);
    if(id){
        let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData=await ChildrenService.getAllChildrenbycenter(id,key,pageNumber,limit)
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        children: resData.children,
    })
    }
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
    
}
let create=async(req,res)=>{
    console.log('create')
    let id =req.params.id;
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    if (!req.body.name || !req.body.status || !req.body.gender  ){
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    if (!moment(req.body.JoinDate, 'YYYY-MM-DD', true).isValid()) {
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
    console.log(req.body)
    let message = await ChildrenService.createChildren(id,req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    }   
    
}
let UpdateChildren=async (req,res)=>{
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }
    let id =req.params.id;
    if (req.file) {
        req.body.image = req.file.path;
    }
    let resData=await ChildrenService.UpdateChildren(req.params.id,req.body)
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
       
        children: resData.children,
    })
}
let getallChildren=async (req,res)=>{
    console.log(req.query.key)
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData=await ChildrenService.getAllChildren(key,pageNumber,limit)
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        children: resData.children,
    })
    }
   

module.exports = {
    DeleteChildren: DeleteChildren,
    getChildrenById: getChildrenById,
    getallChildrenbycenter:getallChildrenbycenter,
    create:create,
    UpdateChildren:UpdateChildren,
    getallChildren:getallChildren
}
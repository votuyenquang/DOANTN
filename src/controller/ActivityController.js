const ActivityService=require('../service/ActivityService')
let getallactivity=async(req,res)=>{
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    console.log(req.params.page)
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData=await ActivityService.getAllactivity(key,pageNumber,limit)
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        activity: resData.activity,
    })
}
let deleteactivity=async (req, res) => {
    let id = req.params.id;
    console.log(id)
    if (!id) {
        return res.status(400).json({ message: 'Thiếu tham số id' });
    }
    let resData = await ActivityService.deleteactivity(id)
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).j
}
let getactivitybyid=async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let resData = await ActivityService.getactivitybyid(id);
        if(resData.activity){
            return res.status(200).json({
                errCode: 0,
                activity:resData.activity
            })
        }
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy center có id này',
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let getactivitybycenter=async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    console.log(req.params.page)
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData=await ActivityService.getAllactivitybycenterid(id,key,pageNumber,limit)   
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        activity: resData.activity,
    })
    }
    else{
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}   
let createActivity=async (req, res) => {
    let id =req.params.id;
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    if (!req.body.title || !req.body.content || !req.body.contentHTML  ){
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    req.body.image = req.file.path
    let message = await ActivityService.createActivity(id,req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    } 
}
let updateActivity=async (req, res) => {
    let id =req.params.id;
    if (req.file) {
        req.body.image = req.file.path;
    } 

    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    if (!req.body.title || !req.body.content || !req.body.contentHTML  ){
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
        
    }
    let message = await ActivityService.updateActivity(id,req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    } 
}
module.exports = {
    getallactivity:getallactivity,
    deleteactivity:deleteactivity,
    getactivitybyid:getactivitybyid,
    createActivity:createActivity, 
    updateActivity:updateActivity,
    getactivitybycenter:getactivitybycenter
}
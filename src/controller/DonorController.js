const donorService=require('../service/donorService')
let createDonor=async (req, res) => {
    if (!req.body.idcenter || !req.body.idaccount||!req.body.amount||!req.body.note) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message = await donorService.create(req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    }   
}
let getlistdonorbycenter=async (req, res) => {
    let id = parseInt(req.params.id);
    if(!req.query.begin){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian bắt đầu'
        })
    }
    if(!req.query.end){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian kết thúc'
        })
    }
    if (id) {
        let pageNumber = req.query.page === undefined ? 0: req.query.page;
        let limit = req.query.limit === undefined ? 10 : req.query.limit;
        data = {
            begin: req.query.begin,
            end: req.query.end,
            pageNumber:pageNumber,
            limit:limit
        }
        
        let resData=await donorService.getlistdonorbycenter(id,data)
        let page ={};
        page.size= resData.size;
        page.totalPages= resData.totalPages;
        page.totalElements = resData.totalElements;
        page.page = resData.page;
        totalAmount=resData.totalAmount
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            page: page,
            donor: resData.donor,
            totalAmount:totalAmount
        })
    }
    else{
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}

module.exports={
    createDonor:createDonor,
    getlistdonorbycenter:getlistdonorbycenter
}
const commentService=require('../service/commentService')

let creatCommet=async (req, res) => {
    console.log(req.body);
    if (!req.body.idactivity || !req.body.idaccount||!req.body.content) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message=await commentService.creatCommet(req.body)
    return res.status(200).json({
        erroCode: 0,
        message: 'OK',
        totalcomment: message.totalcomment,
        listcomment:message.listcomment
    })
}
let deletecomment=async (req, res) => {
    let id =req.params.id;
    console.log(id)
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    let resData=await commentService.deleteComment(id)
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let getcommentbyactivity=async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData=await commentService.getlistcomment(id,pageNumber,limit)
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        Comment: resData.Comment,
    })}
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }

}

module.exports={
    creatCommet:creatCommet,
    deletecomment:deletecomment,
    getcommentbyactivity:getcommentbyactivity
}
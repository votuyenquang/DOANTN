const adropt_requestService=require('../service/adropt_requestService')

let getadropt_requesbychildrentid=async (req, res) => {
    let id = req.params.id;
    console.log(id)
    if (id) {
        let resData = await adropt_requestService.getadropt_requesbychildrentid(id);
        if(resData.Adropt_request){
            return res.status(200).json({
                errCode: 0,
                Adropt_request:resData.Adropt_request
            })
        }
        else {
            return res.status(200).json({
                errCode: 0,
                Adropt_request:false
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let creatadropt_request=async (req, res) => {
    if (!req.body.children_id || !req.body.request||!req.body.adropt_detail_id) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message=await adropt_requestService.creatadropt_request(req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message);
    } else if (message.errCode == 1) {
        return res.status(409).json(message);
    }   
}
let Updateadropt_request  =async (req,res)=>{
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }
    if ( !req.body.request) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let resData=await adropt_requestService.Updateadropt_request(req.params,req.body)
    if (resData.errCode == 2) {
        return res.status(404).json({
            errCode: resData.errCode,
            message: resData.errMessage
        })
    } else {
        return res.status(200).json({
            errCode: resData.errCode,
            message: resData.errMessage
        })
    }
}
let getadropt_requesbydetailltid=async (req,res)=>{
    let id = parseInt(req.params.id);
    if (id) {
        let resData=await adropt_requestService.getadropt_requesbydetailltid(id)
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            totalElements: resData.totalElements,
            adropt_request: resData.adropt_request,
        })
    }
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }

}
let Deleteadropt_reques=async (req,res)=>{
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: 'Thiếu tham số id' });
    }
    let resData = await adropt_requestService.Deleteadropt_reques(id)
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
}
let getadropt_requesbycenterid=async (req,res)=>{
    let id = parseInt(req.params.id);
    let key;
    if (req.query.key === undefined) {
        key = ''
    } else {
        key = req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0 : req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    if (id) { let resData=await adropt_requestService.getadropt_requesbycenterid(id,key, pageNumber, limit)
        let page ={};
        page.size= resData.size;
        page.totalPages= resData.totalPages;
        page.totalElements = resData.totalElements;
        page.page = resData.page;
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            adropt_request: resData.adropt_request,
            page: page,
        })
    }
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
module.exports={
    getadropt_requesbychildrentid:getadropt_requesbychildrentid,
    creatadropt_request:creatadropt_request,
    Updateadropt_request:Updateadropt_request,
    getadropt_requesbydetailltid:getadropt_requesbydetailltid,
    Deleteadropt_reques:Deleteadropt_reques,
    getadropt_requesbycenterid:getadropt_requesbycenterid
}
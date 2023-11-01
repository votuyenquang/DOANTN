const adropt_detailService=require('../service/adropt_detailService')

let getadropt_detailbyid=async (req,res)=>{
    let id = parseInt(req.params.id);
    if (id) {
        let resData = await adropt_detailService.getadropt_detailbyid(id);
        if(resData){
            return res.status(200).json({
                errCode: 0,
                Adropt_detail:resData.Adropt_detail
            })
        }
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy Hoso có id này',
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}

let getadropt_detailbyacountid =async (req,res)=>{
    let id = parseInt(req.params.id);
    if (id) {
        let resData = await adropt_detailService.getadropt_detailbyacountid(id);
        if(resData.Adropt_detail){
            return res.status(200).json({
                errCode: 0,
                Adropt_detail:resData.Adropt_detail
            })
        }
        else {
            return res.status(200).json({
                errCode: 0,
                Adropt_detail:false
            })
        }
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let creatadropt_detail=async (req, res) => {
    if (!req.body.income || !req.body.marital_status||!req.body.family_status||!req.body.account_id) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message=await adropt_detailService.creatadropt_detail(req.body)
    if (message.errCode == 0) {
        return res.status(200).json(message);
    } else if (message.errCode == 1) {
        return res.status(409).json(message);
    }   
}
let Updateadropt_detail=async (req,res)=>{
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }
    if (!req.body.income || !req.body.marital_status||!req.body.family_status||!req.body.account_id) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    
    let resData=await adropt_detailService.Updateadropt_detail(req.params,req.body)
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
module.exports = {
    getadropt_detailbyid:getadropt_detailbyid,
    getadropt_detailbyacountid:getadropt_detailbyacountid,
    creatadropt_detail:creatadropt_detail,
    Updateadropt_detail:Updateadropt_detail
}
const proofsService=require('../service/proofsService')

let getlistproofsbyid=async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let resData=await proofsService.getlistproofsbyid(id)
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            totalElements: resData.totalElements,
            proofs: resData.proofs,
        })
    }
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
   
}


let createproofs=async (req, res) => {
    let id = parseInt(req.params.id);
    if (id) {
        req.body.image = req.file.path;
        let message = await proofsService.createproofs(id,req.body)
        if (message.errCode == 0) {
            return res.status(200).json(message);
        } 
    }
    else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let Deleteproofs=async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: 'Thiếu tham số id' });
    }
    let resData = await proofsService.Deleteproofs(id)
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
}
module.exports={
    getlistproofsbyid:getlistproofsbyid,
    createproofs:createproofs,
    Deleteproofs:Deleteproofs
    
}
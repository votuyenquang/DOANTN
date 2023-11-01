const likeService = require('../service/LikeService')
let like = async (req, res) => {
    console.log(req.body);
    if (!req.body.idactivity || !req.body.idaccount) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message = await likeService.like(req.body)
    return res.status(200).json({
        erroCode: 0,
        message: 'OK',
        totallike: message.totallike,
    })
}
let dislike = async (req, res) => {
    if (!req.body.idactivity || !req.body.idaccount) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    let message = await likeService.dislike(req.body)
    return res.status(200).json({
        erroCode: 0,
        message: 'OK',
        totallike: message.totallike,
        listlike:message.listlike
    })
}
let checklikebyidacount = async (req, res) => {
    if (!req.body.idactivity || !req.body.idaccount) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
        let message = await likeService.checklikebyidacount(req.body)
        return res.status(200).json({
            erroCode: 0,
            message: 'OK',
            like: message? true : false,
            
        })
    
}
module.exports = {
    like: like,
    dislike: dislike,
    checklikebyidacount: checklikebyidacount
}
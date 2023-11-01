const notificationService=require('../service/notificationService')
let GetNotificationForUserByAccountId = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let notification = await notificationService.GetNotificationForUserByAccountId(id);
    return res.status(200).json({message: notification});
}
let ChangeStatusNotifications=async(req, res) => {
    console.log('aa')
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let resData = await notificationService.ChangeStatusNotifications(id);
    if(resData.errCode === 0){
        return res.status(200).json({message: resData.message});
    }
    if(resData.errCode === 1){
        return res.status(200).json({message: resData.message});
    }
}
module.exports = {
    ChangeStatusNotifications:ChangeStatusNotifications,
    GetNotificationForUserByAccountId:GetNotificationForUserByAccountId
}
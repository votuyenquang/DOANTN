const db = require('../models');

let GetNotificationForUserByAccountId=async(id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notification = await db.Notification.findAll({
                where:{
                    account_id:id
                },
                order: [['createdAt', 'DESC']],
                
            })
            resolve(notification);
        } catch (error) {
            reject(error)
        }
    })
}
let ChangeStatusNotifications=async(id, accountid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let notification = await db.Notification.update({
                status: false,
            },
                {
                    where: { id: id }
                }
            )
            if (!notification) {
                resData.errCode = 1;
                resData.message = 'Không tồn tại thông báo có id này';
            }
            resData.errCode = 0;
            resData.message = 'OK';

            resolve(resData);
            
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    ChangeStatusNotifications:ChangeStatusNotifications,
    GetNotificationForUserByAccountId:GetNotificationForUserByAccountId
}
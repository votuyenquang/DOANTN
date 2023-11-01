const db = require('../models');
let like = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let account = await db.Account.findOne({
                where: {
                    id: data.idaccount
                }
            })

            if (!account) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại account  có id này";
            }
            else {
                await db.Like.create({
                    acount_id: data.idaccount,
                    activity_id: data.idactivity
                })
                const { count, rows } = await db.Like.findAndCountAll({ where: { activity_id: data.idactivity } })
                let resData = {};
                resData.totallike = count,
                resData.listlike=rows
                resolve(resData)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let dislike = async (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const like = await db.Like.findOne({
                where: {
                    acount_id: data.idaccount,
                    activity_id: data.idactivity
                }
            })
            let account = await db.Account.findOne({
                where: {
                    id: data.idaccount
                }
            })

            if (!account || !like) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại account có id này";
            }
            else {
                like.destroy()
                const { count, rows } = await db.Like.findAndCountAll({ where: { activity_id: data.idactivity } })
                let resData = {};
                resData.totallike = count
                resData.listlike=rows
                resolve(resData)
            }
        } catch (error) {
            reject(error)

        }
    })
}
let checklikebyidacount = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await db.Like.findOne({
                where: {
                    acount_id: data.idaccount,
                    activity_id: data.idactivity
                }
            })
            console.log(check)
            resolve(check)
        } catch (error) {
            reject(error)
        }

    })
}
module.exports = {
    like: like,
    dislike: dislike,
    checklikebyidacount: checklikebyidacount
}
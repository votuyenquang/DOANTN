const db = require('../models');

let creatCommet = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await db.Account.findByPk(data.idaccount);

            if (!account) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại account  có id này";
            }
            else {
                await db.Comment.create({
                    account_id: data.idaccount,
                    activity_id: data.idactivity,
                    content: data.content
                })
                const { count, rows } = await db.Comment.findAndCountAll(
                    {
                        where: {
                            activity_id: data.idactivity
                        },
                        include: [

                            {
                                model: db.Account,
                                required: true,
                                as: 'account',
                                attributes: {
                                    exclude: ['password', 'passwordResetToken', 'Token', 'active']
                                },
                                include: {
                                    model: db.Profile,
                                    required: true,
                                    as: 'profile',
                                }
                            },


                        ],
                        order: [['createdAt', 'DESC']],
                    }
                )
                const center = await db.Center.findOne({
                    include: [

                        {
                            model: db.Activity,
                            required: false,
                            as: 'activity',
                            attributes: [],
                            where: { id: data.idactivity }
                        },
                        {
                            model: db.Account,
                            required: false,
                            as: 'account',
                            attributes: {
                                exclude: ['password', 'passwordResetToken', 'Token', 'active']
                            },
                            include: {
                                model: db.Profile,
                                required: true,
                                as: 'profile',
                            }
                        },
                    ]
                })
                console.log(rows)
                if(center.account_id!=data.idaccount){
                    let message = `${rows[0].account.profile.name} đã bình luận vào bài viết của bạn `;
                console.log(message)
                let a= await db.Notification.create({
                    activity_id: data.idactivity,
                    account_id: center.account_id,
                    message: message,
                    status: true
                })
                }
                
                console.log('a',center.account_id)
                console.log('assa',data.idaccount)

                
                const uniqueRows = [];
                const accountIdSet = new Set();

                for (const row of rows) {
                    const accountId = row.account.id;
                    if (!accountIdSet.has(accountId)) {
                        accountIdSet.add(accountId);
                        uniqueRows.push(row);
                    }
                }
                let message2 = `${rows[0].account.profile.name} đã bình luận vào bài viết`;
                for (let i = 1; i < uniqueRows.length; i++) {
                    const row = uniqueRows[i];
                    const accountId = row.account.id;
                    
                        await db.Notification.create({
                            activity_id: data.idactivity,
                            account_id: accountId,
                            message: message2,
                            status: true
                          });
                    
                  }
                let resData = {};
                resData.totalcomment = count,
                    resData.listcomment = rows
                   
                resolve(resData)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteComment = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let Comment = await db.Comment.findOne({
                where: {
                    id: id
                },
            })
            if (!Comment) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại binh luan có id này";
            }
            else {
                Comment.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";
            }
            resolve(resData)
        } catch (error) {
            reject(error)
        }
    })
}
let getlistcomment = async (id, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Comment.findAndCountAll({
                where: {
                    activity_id: id
                },
                include: [
                    {
                        model: db.Account,
                        required: false,
                        as: 'account',
                        attributes: {
                            exclude: ['password', 'passwordResetToken', 'Token', 'active']
                        },
                        include: {
                            model: db.Profile,
                            required: true,
                            as: 'profile',
                        }
                    },
                ],
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
                order: [['createdAt', 'DESC']]
            })
            const uniqueRows = [];
            const accountIdSet = new Set();
            for (const row of rows) {
                const accountId = row.account.id;

                if (!accountIdSet.has(accountId)) {
                    accountIdSet.add(accountId);
                    uniqueRows.push(row);
                }
            }
            console.log(uniqueRows)
            let resData = {};
            resData.Comment = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resolve(resData);
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    creatCommet: creatCommet,
    deleteComment: deleteComment,
    getlistcomment: getlistcomment
}
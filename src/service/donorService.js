const db = require('../models');
const { Sequelize, Op, DataTypes } = require('sequelize');

let create = async (data) => {
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
                const donor = await db.Donor.create({
                    center_id: data.idcenter,
                    account_id: data.idaccount,
                    amount: data.amount,
                    note: data.note
                })
                resolve({
                    errCode: 0,
                    message: donor
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getlistdonorbycenter = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
          
            const page = parseInt(data.pageNumber);
            const limit = parseInt(data.limit);
            console.log(page,limit)
            let offset = page * limit;
            const { count, rows } = await db.Donor.findAndCountAll({

                where: {
                    center_id: id,
                    createdAt: {
                        [Sequelize.Op.between]: [data.begin, data.end]
                    }
                },
                include: [
                    {
                        model: db.Account,
                        required: false,
                        as: 'account',
                        attributes: {
                            exclude: ['password', 'passwordResetToken', 'Token', 'active', 'createdAt', 'updatedAt']
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
            })
            const result = await db.Donor.findOne({
                where: {
                    center_id: id,
                    createdAt: {
                        [Sequelize.Op.between]: [data.begin, data.end]
                    }
                },
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('amount')), 'totalAmount']
                ],
                raw: true
            });

            const totalAmount = result.totalAmount;

            console.log('Total Amount:', totalAmount);
            console.log(rows)
            let resData = {};
            resData.donor = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resData.totalAmount=totalAmount
            resolve(resData);

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    create: create,
    getlistdonorbycenter: getlistdonorbycenter
}
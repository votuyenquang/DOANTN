const { where } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const db = require('../models');

let deleteactivity = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let activity = await db.Activity.findOne({
                where: {
                    id: id
                }
            })
            if (!activity) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại  tre  có id này";
            }
            else {
                activity.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";
            }
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })
}
let getactivitybyid = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let activity = await db.Activity.findOne({
                where: { id: id },
                attributes: ['id', 'title','img','content','contentHTML','createdAt','updatedAt',[db.sequelize.fn('COUNT', db.sequelize.col('like.activity_id')), 'totalLikes']],
                include: [
                    {
                        model: db.Like,
                        required: false,
                        as: 'like',
                        attributes: []
                    },
                    {
                        model: db.Center,
                        required: true,
                        as: 'center',
                    },
                    
                ],
            })
           
            resData.activity=activity
            resolve(resData)
        } catch (error) {
            reject(error)
        }
    })
}
let getAllactivity = async (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            
            const { count, rows } = await db.Activity.findAndCountAll({
                attributes: [
                  'id',
                  'title',
                  'img',
                  'createdAt',
                  'updatedAt',
                  [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.activity_id = Activity.id)'), 'totalLike'],
                  [Sequelize.literal('(SELECT COUNT(*) FROM Comments WHERE Comments.activity_id = Activity.id)'), 'totalComment']
                ],
                group: ['Activity.id'],
                include: [
                  {
                    model: db.Like,
                    required: false,
                    as: 'like',
                    attributes: []
                  },
                  {
                    model: db.Center,
                    required: true,
                    as: 'center',
                  },
                  {
                    model: db.Comment,
                    required: false,
                    as: 'comment',
                    attributes: []
                  },
                ],
                order: [['createdAt', 'DESC']],
              },{
                
                offset: offset,
                limit: limit,
              });
              
              // Tạo đối tượng kết quả
              const resData = {};
              resData.activity = rows;
              resData.limit = limit;
              resData.totalPages = Math.ceil(count.length / limit);
              resData.totalElements = count.length;
              resData.page = page;
              
              resolve(resData);
        } catch (error) {
            reject(error)
        }
    })
}
let getAllactivitybycenterid = async (id, key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Activity.findAndCountAll(
                {
                    attributes: [
                        'id',
                        'title',
                        'img',
                        'content',
                        'contentHTML',
                        'createdAt',
                        'updatedAt',
                        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.activity_id = Activity.id)'), 'totalLike'],
                        [Sequelize.literal('(SELECT COUNT(*) FROM Comments WHERE Comments.activity_id = Activity.id)'), 'totalComment']
                      ],
                    order: [['createdAt', 'DESC']],
                    include: [
                        
                        {
                            model: db.Center,
                            required: true,
                            as: 'center',
                        },
                       
                    ],
                    group: ['Activity.id'],
                    where: {
                        center_id: id
                    },
                    order: [['createdAt', 'DESC']]
                },
                {
                    offset: offset,
                    limit: limit,
                    raw: true,
                    nest: true,
                   
                }
            )
            let resData = {};
            resData.activity = [...new Set(rows)];
            resData.limit = limit;
            resData.totalPages = Math.ceil(count.length / limit);
            resData.totalElements = count.length
            resData.page = page;
            resolve(resData);
        } catch (error) {
            reject(error)
        }
    })
}
let createActivity = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const activity = await db.Activity.create({
                title: data.title,
                content: data.content,
                contentHTML: data.contentHTML,
                center_id: id,
                img: data.image
            })
            resolve({
                errCode: 0,
                message: activity
            });
        } catch (error) {
            reject(error)
        }
    })
}
let updateActivity = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        let resData = {};
        try {
            const activity = await db.Activity.findOne({
                where: { id: id }
            })
            if (activity) {
                await db.Activity.update({
                    title: data.title,
                    content: data.content,
                    contentHTML: data.contentHTML,
                    img: data.image

                }, {
                    where: {
                        id: id
                    }
                })
                resData.errCode = 0;
                resData.errMessage = activity
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "activity ko ton tai"
            }
            resolve(resData)
        } catch (error) {
            reject(error);

        }
    })
}
module.exports = {
    deleteactivity: deleteactivity,
    getactivitybyid: getactivitybyid,
    getAllactivity: getAllactivity,
    getAllactivitybycenterid: getAllactivitybycenterid,
    createActivity: createActivity,
    updateActivity: updateActivity
}
const db = require('../models');
const { Sequelize, Op, DataTypes } = require('sequelize');
let deleteChildren=(id)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let chidren=await db.Children.findOne({
                where:{
                    id:id
                }
            })
            if(!chidren){
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại  tre  có id này";
            }
            else {
                chidren.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";
            }
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })
}
let getChildrenByid=(id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(id)
            let chidren= await db.Children.findOne({
                where:{id:id},
                include: [
                    {
                        model: db.Center,
                        required: true,
                        as: 'center',
                    },
                ]
            })
            resolve(chidren);
            
        } catch (error) {
            reject(error);
        }
    })
}
let getAllChildrenbycenter= async(id ,key,page,limit)=>{
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Children.findAndCountAll({
                
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
                where: {
                    [Op.or]: [
                      { 'Children.name': db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('Children.name')), 'LIKE', '%' + key + '%') },
                    ],
                    center_id:id
                  },
                

            })
            let date=new Date();
            date.setDate(date.getDate()-3)
            db.Adropt_request.destroy({
              where:{
                  request:'unaccept',
                  updatedAt:{[Op.lt]:date}
              }
            })
            console.log(rows)
            let resData = {};
            resData.children = rows;
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
let createChildren=async (id, data) => {
     return new Promise(  async (resolve, reject) => {
        try {
            let checkCenter=await db.Center.findOne({
                where:{id:id}
            })
            if(checkCenter){
                const children=await db.Children.create({
                    name:data.name,
                    personalPicture:data.image,
                    status:data.status,
                    gender:data.gender=== '1' ? true : false,
                    age:data.age,
                    JoinDate:data.JoinDate,
                    center_id:id
                })
                resolve({
                    errCode: 0,
                    message: children
                });
            }
            else{
                resolve({
                    errCode: 1,
                    message: 'center ko tồn tại'
                })
            }
        } catch (error) {
            reject(error);
        }
     })
}
let UpdateChildren=(id, data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data)
        let resData = {};
        try {
            let chidren =await db.Children.findByPk(id)
            if(chidren){
                await db.Children.update({
                    name:data.name,
                    personalPicture:data.image,
                    status:data.status,
                    gender:data.gender=== '1' ? true : false,
                    age:data.age,
                    JoinDate:data.JoinDate,
                },{where: {
                    id: id
                }})
                resData.errCode = 0;
                resData.errMessage = chidren
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "Children ko ton tai"
            }
            resolve(resData)
        } catch (error) {
            reject(error);
        }
    })
}
let getAllChildren=async(key,page,limit)=>{
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            console.log(key)
            const { count, rows } = await db.Children.findAndCountAll({
                where: {
                  [Op.or]: [
                    { 'Children.name': db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('Children.name')), 'LIKE', '%' + key + '%') },
                  ]
                },
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
                include: [
                  {
                    model: db.Center,
                    required: true,
                    as: 'center',
                  },
                ]
              });
              
              let date=new Date();
              date.setDate(date.getDate()-3)
              db.Adropt_request.destroy({
                where:{
                    request:'unaccept',
                    updatedAt:{[Op.lt]:date}
                }
              })
            // console.log(rows)
            let resData = {};
            resData.children = rows;
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
    deleteChildren:deleteChildren,
    getChildrenByid:getChildrenByid,
    getAllChildrenbycenter:getAllChildrenbycenter,
    createChildren:createChildren,
    UpdateChildren:UpdateChildren,
    getAllChildren:getAllChildren
}
const db = require('../models');
const bcrypt = require('bcryptjs');
const AuthService = require('./AuthService');
const emailService = require('./emailService');
const { v4: uuidv4 } = require('uuid');

const salt = bcrypt.genSaltSync(10);
const Chance = require('chance');
const chance = new Chance();
const { Sequelize, Op, DataTypes } = require('sequelize');

let seedData = async () => {
    try {
        // Đồng bộ hóa mô hình với cơ sở dữ liệu
        const statusOptions = ['Thương rứa hè', 'Thương cháu quá .bị mẹ bỏ rơi !!!', 'Thương con quá', 'Tội quá đi', 'Thương con quá. Chúc con một đời bình an', 'Xin nuôi được không ạ', 'Quá trời đáng iu gòi :3', 'Các con ngày càng lớn càng ngoan cảm ơn các mẹ Các dì....', 'Xin gửi lời cảm ơn đến các mẹ và lời chúc tốt lành đến các bạn nhỏ trong làng', 'cho đi là còn mãi', 'Thương con'];
        for (let i = 52; i < 53; i ++) {
            // // Tạo dữ liệu ngẫu nhiên sử dụng Faker
            // const name = chance.name();
            // const email = chance.email();
            // const address = chance.address();
            // const image = chance.avatar();
            // const gender = '1';
            // const phoneNumber = parseInt(chance.phone().replace(/\D/g, ''));
            // const birthday = chance.birthday();
            // let hashPasswordFromBcrypt = await hashUserPassword('123456');
            // let [role, created] = await db.Role.findOrCreate({
            //   where: { name: 'user' },
            // });
            const status = chance.pickone(statusOptions);
            // const age=chance.integer({ min: 1, max: 19 })
            // // let chidren =await db.Children.findByPk(i);
            // // if(chidren.gender==1){
            // //     chidren.update({
            // //         personalPicture:'https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
            // //     })
            // // }
            // // else{
            // //     chidren.update({
            // //         personalPicture: 'https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
            // //     })
            // // }

            // // Tạo bản ghi mới trong cơ sở dữ liệu
            // // const children=await db.Children.create({
            // //     name:name,
            // //     personalPicture:image,
            // //     status:status,
            // //     gender:gender=== '1' ? true : false,
            // //     age:age,
            // //     JoinDate:birthday,
            // //     center_id:23
            // // })
            //tao donor
            //     const amount=chance.integer({ min: 100000, max: 500000 })
            //     const donor= await db.Donor.create({
            //         center_id:23,
            //         account_id:i,
            //         amount:amount,
            //         note:'Hỗ trợ trẻ tai trung tâm'
            //         })
            //tao like
            // await db.Like.create({
            //     acount_id: i,
            //     activity_id: 26

            // })
            // tao comment
            // await db.Comment.create({
            //     account_id: i,
            //     activity_id: 26,
            //     content: status
            // })
            let profile =await db.Profile.findByPk(533);
        
            if(profile.gender==true){
                profile.update({
                    avatar:'https://res.cloudinary.com/dfw20cady/image/upload/v1687921180/uftgfshktg8uuqn07xru.jpg'
                })
            }
            else{
                profile.update({
                    avatar: 'https://res.cloudinary.com/dfw20cady/image/upload/v1689362567/febkodbj7iuqalbvdr74.jpg'
                })
            }

        }

        console.log('Dữ liệu đã được tạo thành công.');
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu:', error);
    } finally {
        // Đóng kết nối với cơ sở dữ liệu sau khi hoàn thành
        await db.sequelize.close();
    }
};


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}
let createCenter = async (data) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                let checkemail = await AuthService.checkAccountEmail(data.email)

                if (checkemail === true) {
                    resolve({
                        errCode: 1,
                        message: 'email đã tồn tại'
                    })
                }
                else {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                    let [role, created] = await db.Role.findOrCreate({
                        where: { name: 'center' }
                    })
                    const profile = await db.Profile.create({
                        name: data.name,
                        address: data.address,
                        avatar: data.images,
                        gender: data.gender === '1' ? true : false,
                        phoneNumber: data.phoneNumber,
                        birthday: data.birthday
                    })
                    const account = await db.Account.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        active: data.active,
                        role_id: role.id,
                        profile_id: profile.id,
                        Token: ''

                    })
                    const center = await db.Center.create({
                        name: data.name,
                        email: data.email,
                        adress: data.address,
                        phoneNumber: data.phoneNumber,
                        picture: data.images,
                        account_id: account.id
                    })
                    id = uuidv4();
                    if (data.active == '1') {
                        emailService.sendEmailCreatedCenter({
                            receiverEmail: data.email,
                            patientName: data.email,
                            password: data.password
                        });
                    }
                    resolve({
                        errCode: 0,
                        message: center
                    });
                }
            } catch (error) {
                reject(error);
            }
        })
}
let deleteCenter = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let center = await db.Center.findOne({
                where: {
                    id: id
                },
            })
            if (!center) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại trung tam có id này";
            }
            else {
                center.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";
            }
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllCenter = async (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Center.findAndCountAll({
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', '%' + key + '%') },
                    ]
                }
            })
            console.log(rows)
            let resData = {};
            resData.center = rows;
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
let UpdateCenter = (params, data) => {
    console.log('a', data)
    return new Promise(async (resolve, reject) => {
        let resData = {};
        try {
            let center = await db.Center.findByPk(params.id)
            if (center) {
                await db.Center.update({
                    name: data.name,
                    email: data.email,
                    adress: data.address,
                    phoneNumber: data.phoneNumber,
                    picture: data.image,
                }, {
                    where: {
                        id: center.id
                    }
                })
                resData.errCode = 0;
                resData.errMessage = center
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "Center ko ton tai"
            }
            resolve(resData)
        } catch (error) {
            reject(error);
        }
    })
}
let getCenterById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let center = await db.Center.findOne({
                where: { id: id }
            })
            countchildent = await db.Children.count({
                where: {
                    center_id: id
                }
            })
            const a=  await db.Activity.findOne(
                {
                    attributes: [
                        'id',
                        'center_id',
                        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.activity_id = Activity.id)'), 'totalLike'],
                        [Sequelize.literal('(SELECT COUNT(*) FROM Comments WHERE Comments.activity_id = Activity.id)'), 'totalComment']
                      ],
                   
                   
                    group: ['Activity.id'],
                    where: {
                        center_id: id
                    },
                    raw: true
                },
               
            )
            console.log(a)
            resData.totalCommentlike=a
            resData.countchildent = countchildent
            resData.center = center
            resolve(resData)
        } catch (error) {
            reject(error)
        }
    })
}
let getcenterbyacountid = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let center = await db.Center.findOne({
                where: { account_id: id }
            })
            resolve(center)
        } catch (error) {
            reject(error)
        }
    })
}
let getallcenterAL = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('asa')
            const { count, rows } = await db.Center.findAndCountAll({
               
                raw: true,
                nest: true,
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', '%' + key + '%') },
                    ]
                }
            })
            
           const centers = await db.Center.findAll({
                    attributes: ['id','name', 'email', 'adress', 'phoneNumber', 'picture', 'account_id',[Sequelize.literal('(SELECT SUM(amount) FROM Donors WHERE center_id = Center.id)'), 'totalAmount'],[Sequelize.literal('(SELECT COUNT(*) FROM Children WHERE Children.center_id = Center.id)'), 'totalChildren']],
                    
                    group: ['Center.id'],
                    raw: true
                })
            const centerIds = centers.map(center => center.id);
          const a=  await db.Activity.findAll(
                {
                    attributes: [
                        'id',
                        'center_id',
                        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.activity_id = Activity.id)'), 'totalLike'],
                        [Sequelize.literal('(SELECT COUNT(*) FROM Comments WHERE Comments.activity_id = Activity.id)'), 'totalComment']
                      ],
                   
                   
                    group: ['Activity.id'],
                    where: {
                        center_id: {
                            [Op.in]: centerIds
                        }
                    },
                    raw: true
                },
               
            )
            let resData = {};
          
            resData.totalAmountchildre=centers;
            resData.totalCommentlike=a
            resData.keyserch=rows
            resolve(resData)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createCenter: createCenter,
    deleteCenter: deleteCenter,
    getAllCenter: getAllCenter,
    UpdateCenter: UpdateCenter,
    getCenterById: getCenterById,
    getcenterbyacountid: getcenterbyacountid,
    getallcenterAL: getallcenterAL,
    seedData: seedData
}
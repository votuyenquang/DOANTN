const db = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const AuthService = require('./AuthService');
const emailService = require('./emailService')
const { Op, where } = require('sequelize');

const salt = bcrypt.genSaltSync(10);


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
let buildUrlEmail= (token) =>{
    let result = `https://trungtamquanlytremocoi.onrender.com/auth/verify-account?token=${token}` 
    return result;
}

let createNewAccount = async (data, roleName) => {
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
                    id = uuidv4();
                    ///xacthuc email
                    if (data.active == '0') {
                        
                        emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.email,
                            redirectLink:buildUrlEmail(id)
                        });
                    }

                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                    let [role, created] = await db.Role.findOrCreate({
                        where: { name: 'user' }
                    })
                    const profile = await db.Profile.create({
                        name: data.name,
                        address: data.address,
                        avatar: data.image,
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
                        Token:id

                    })
                    delete account.password;
                    resolve({
                        errCode: 0,
                        message: account
                    });
                }
            } catch (error) {
                reject(error);
            }

        }
    )
}

let ResetPassword   = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await db.Account.findOne({
                where: {
                    email: data.email
                }
            })

            if (account) {
                let newPaw = Math.floor(Math.random() * 100000000) + '';
                let hashPasswordFromBcrypt = await hashUserPassword(newPaw);
                account.password = hashPasswordFromBcrypt;
                let a = await db.Account.update({
                    password: hashPasswordFromBcrypt
                },
                    {
                        where: {
                            email: data.email
                        }
                    })
                console.log(account)
                console.log(newPaw)

                await emailService.sendEmailToResetPw({
                    receiverEmail: account.email,
                    patientName: account.email,
                    newPassword:newPaw
                });
                resolve({
                    errCode: 0,
                    message: 'truy cập email để xem password'
                })
            }
            else {
                resolve({
                    errCode: 2,
                    message: 'người dùng không tồn tại'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteAccount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let account = await db.Account.findOne({
                where: {
                    id: id
                },
                attributes: {
                    exclude: ['password']
                },

            })
            if (!account) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại tai khoan có id này";
            }
            else {
                let profile = await db.Profile.findOne({
                    where: {
                        id: account.profile_id
                    }
                })
                account.destroy();
                profile.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";

            }
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })

}
let getAllAcount = async (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
           
            const { count, rows } = await db.Account.findAndCountAll({
                include: [
                    {
                        model: db.Profile,
                        required: true,
                        as: 'profile',
                       
                        [Op.or]: [
                            { name: db.sequelize.where(db.sequelize.fn(db.sequelize.col('name')), 'LIKE', '%' + key + '%') },
                        ]
                    },

                    
                ],
                attributes: {
                    exclude: ['password']
                },

                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
            });

            console.log(rows)
            let resData = {};
            resData.account = rows;
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
let changePassword = (params, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await db.Account.findByPk(params.id);
            if (account) {
                let check = await bcrypt.compareSync(data.password, account.password);
                if (check) {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.newPassword);
                    db.Account.update(
                        {
                            password: hashPasswordFromBcrypt
                        },
                        {
                            where: {
                                id: params.id
                            }
                        }
                    )
                    resolve({
                        errCode: 0,
                        message: 'thay đổi mật khẩu thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 4,
                        message: 'sai mật khẩu'
                    })
                }
            }
            else {
                resolve({
                    errCode: 2,
                    message: 'người dùng không tồn tại'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getaccountById=(data)=>{
    return new Promise( async (resolve, reject)=>{
        try {
            let account =await db.Account.findByPk(data.id,{
                include:[{
                    model:db.Role,
                    required: true,
                    as: 'role',
                    
                },{
                    model:db.Profile,
                    required: true,
                    as: 'profile',
                    
                },
            ],attributes: {
                    exclude: ['password']
                },
            })
            delete account.password;
            if(!account){
                return resolve({
                    errCode:2,
                    message:'mã người dùng không tồn tại'
                })
                
            }
            else{
                return resolve({
                    
                    errCode:0,
                    account: account
                }) 
            }
        } catch (error) {
            reject(error)
        }

    })

}
let UpdateAccount=(params,data)=>{
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try {
            // console.log(data)
            let account = await db.Account.findByPk(params.id,
                {   attributes: {
                        exclude: ['password']
                    },
                });
                if(account){
                    
                    await db.Profile.update(
                        {
                        name: data.name,
                        address: data.address,
                        avatar: data.image,
                        gender: data.gender === '1' ? true : false,
                        phoneNumber: data.phoneNumber,
                        birthday: data.birthday,
                        },
                        {
                            where:{
                                id: account.profile_id
                            }
                        }
                    )
                    let profile=await db.Profile.findByPk(account.profile_id);
                    resData.errCode = 0;
                    // console.log(profile)
                resData.errMessage = profile

                }
                else {
                    resData.errCode = 2;
                    resData.errMessage = "Account ko ton tai"
                }
                resolve(resData)
        } catch (error) {
            reject(error);
        }
    })
}
let verifyUser =(data)=>{
    return new Promise( async (resolve,reject)=>{
        try {
            if(!data.token){
                resolve({
                    errCode:1,
                    errMessage:'Lỗi token'
                })
            } else{
                let account=await db.Account.findOne({
                    where:{
                        Token: data.token,
                        active: 0
                    },
                    raw: false
                })

                if(account){
                    account.active = true
                    account.Token = ''
                    await account.save()

                    resolve({
                        errCode:0,
                        errMessage: 'xác thực thành công'
                    })
                } else {
                    resolve({
                        errCode:2,
                        errMessage: 'Tài khoản đã được kích hoạt hoặc không tồn tại'
                    })
                }
            }

        } catch (error) {
           reject(error) 
        }
    })}
    let UpdateAccounttoadmin=(params,data)=>{
        return new Promise(async(resolve, reject) => {
            let resData = {};
            try {
                let account = await db.Account.findByPk(params.id,{   attributes: {
                    exclude: ['password']
                },
            });
            if(account){
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                db.Account.update(
                    {
                        password: hashPasswordFromBcrypt,
                        
                    },
                    {
                        where: {
                            id: params.id
                        }
                    }
                )
                await db.Profile.update(
                    {
                    name: data.name,
                    address: data.address,
                    avatar: data.image,
                    gender: data.gender === '1' ? true : false,
                    phoneNumber: data.phoneNumber,
                    birthday: data.birthday,
                    },
                    {
                        where:{
                            id: account.profile_id
                        }
                    }
                )
                let profile=await db.Profile.findByPk(account.profile_id);
                resData.errCode = 0;
                // console.log(profile)
            resData.errMessage = profile
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "Account ko ton tai"
            }
            resolve(resData)
            } catch (error) {
                reject(error)
            }
        })
    }
module.exports = {
    createNewAccount: createNewAccount,
    ResetPassword: ResetPassword,
    deleteAccount: deleteAccount,
    getAllAcount: getAllAcount,
    changePassword: changePassword,
    getaccountById:getaccountById,
    UpdateAccount:UpdateAccount,
    verifyUser:verifyUser,
    UpdateAccounttoadmin:UpdateAccounttoadmin,
    
}
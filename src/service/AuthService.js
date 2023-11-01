const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let handleAccountLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accountData = {}
            let isExist = await checkAccountEmail(email)
            if (isExist) {
                let account = await db.Account.findOne({
                    include: {
                        model: db.Role,
                        required: true,
                        as: 'role'
                    },
                    where: { email: email },
                    raw: true,
                    nest: true,
                });
                if (account) {
                    let check = await bcrypt.compareSync(password, account.password);
                    if (!check) {
                        accountData.errCode = 4;
                        accountData.errMessage = "Sai mật khẩu";
                    }
                    else {
                        if (account.active == 0) {
                            accountData.errCode = 5;
                            accountData.errMessage = "Tài khoản chưa xác thực hoặc đã bị khóa";
                        }
                        else {
                            accountData.errCode = 0;
                            accountData.errMessage = "0k";
                            delete account.password;
                            accountData.account = account;
                        }
                    }
                }
                else {
                    accountData.errCode = 3;
                    accountData.errMessage = "Tài khoản đã bị khóa";
                }
            }
            else {
                accountData.errCode = 2;
                accountData.errMessage = "Email không tồn tại"
            }
            resolve(accountData);

        } catch (error) {
            reject(error);
        }
    })
}
let checkAccountEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let AccoutData = await db.Account.findOne(
                {
                    where: { email: email }
                }
            )
            if (AccoutData) {
                resolve(true)
            }
            else {
                resolve(false)
            }

        } catch (error) {
            reject(error)
        }
    })
}
let refreshTokenService =(token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function(err, data) {
                if(err){
                    resolve(404).json({
                        message: 'The user is not authemtication'
                    })
                }
                if(user){
                    const newAcessToken = jwt.sign({ email: data.email, id: data.id,role_name:data.role_name },process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
                    resolve({
                        status: 'OK',
                        access_token : newAcessToken
                    })
                }else {
                    resolve({
                        message: 'The user is not authemtication'
                    })
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleAccountLogin: handleAccountLogin,
    checkAccountEmail: checkAccountEmail,
    refreshTokenService:refreshTokenService
}
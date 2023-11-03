const AuthService = require('../service/AuthService');
const AccountService = require('../service/AccountService')
const multer = require('multer')
const path = require('path')
const moment = require('moment');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
dotenv.config();
let handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Nhập thiếu email hoặc mật khẩu'
        })
    }
    let accountData = await AuthService.handleAccountLogin(email, password);
    let accessToken = {};
    let refreshToken={}
    console.log(accountData)
    if (accountData.errCode === 0) {
        const data = {
            email: accountData.account.email,
            id: accountData.account.id,
            role_name: accountData.account.role.name
        }
    console.log("XXXXXXXXXX" +process.env.JWT_SECRET);
        accessToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
        refreshToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '365d' });
    }

    return res.status(200).json(
        {
            errCode: accountData.errCode,
            message: accountData.errMessage,
            accessToken: accessToken,
            refreshToken:refreshToken

        }
    )
}
let signup = async (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.name || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address) {
        return res.status(400).json({
            erroCode: 1,
            message: 'nhập đầy đủ thông tin'
        })
    }
    if (req.body.password.length < 5 || req.body.password.length > 15) {
        return res.status(400).json({
            erroCode: 1,
            message: 'độ dài mật khẩu phải lớn hơn hoặc bằng 5 ký tự và không quá 15 ký tự'
        })
    }
    if (!moment(req.body.birthday, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            erroCode: 1,
            message: 'định dạng birthday không đúng. Ví dụ về định dạng đúng : 2022-11-20'
        })
    }

    if (!req.file) {
        if (req.body.gender === '1') {
            req.body.image = 'https://res.cloudinary.com/dfw20cady/image/upload/v1687921180/uftgfshktg8uuqn07xru.jpg'
        } else {
            req.body.image = 'https://res.cloudinary.com/dfw20cady/image/upload/v1689362567/febkodbj7iuqalbvdr74.jpg'
        }
    } else {
        req.body.image = req.file.path;
    }
    console.log(req.body.image)
    req.body.active = '0';///xacthucemail active=0
    let message = await AccountService.createNewAccount(req.body, 'user');
    console.log(message)
    if (message.errCode == 0) {
        return res.status(200).json(message.errCode);
    } else if (message.errCode == 1) {
        return res.status(409).json(message.errCode);
    }
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')
//xacthucemail
let verifyUser= async(req,res)=>{
    let infor= await AccountService.verifyUser(req.query);
    if(infor.errCode==0){
        return res.status(200).json(infor)
    } else if(infor.errCode==1){
        return res.status(400).json(infor)
    } else if(infor.errCode==2){
        return res.status(404).json(infor)
    } 
    
}
let refreshAccessToken=async(req,res)=>{
    try {
        const token = req.headers['authorization'];
        const refreshTolken = req.headers.token.split(' ')[1]
        if(refreshTolken){
            const response = await AuthService.refreshTokenService(refreshTolken)
            return res.json(response)
        }else {
            return res.json({
                message: 'The refreshTolken is not valid'
            })
        }
    } catch (error) {
        return res.json({
            status: 'err',
            message: error
        })
        
    }
}
module.exports = {
    handleLogin: handleLogin,
    signup : signup,
    upload: upload,
    verifyUser:verifyUser,
    refreshAccessToken:refreshAccessToken
}
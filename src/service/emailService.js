const nodemailer = require("nodemailer");
const process = require('process');
let sendSimpleEmail = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user : process.env.MAIL_ID,
            pass : process.env.MP,
        }
            
    });


    console.log('dsada',dataSend.redirectLink)
    let info = await transporter.sendMail({
        from: '"trungtamxahoi 👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Xac thuc tai khoan ✔", 
        html: `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <p>vui long nhan vao link de xac minh tai khoan </p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>
        `, 
    });
}
let sendEmailToResetPw = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user : process.env.MAIL_ID,
            pass : process.env.MP,
        }
            
    });

    
    let info = await transporter.sendMail({
        from: '"trungtamxahoi 👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Dat lai mat khau ✔", 
        html: `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <p>mat khau moi cua ban la ${dataSend.newPassword}</p>
        `, 
    });
}
let sendNotification = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user : process.env.MAIL_ID,
            pass : process.env.MP,
        }
    });
    let info = await transporter.sendMail({
        from: '"trungtamxahoi 👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Thông báo nhận nuôi trẻ", 
        html: `
        <p>${dataSend.message} xin cảm ơn</p>
        `, 
    });
}
module.exports = {
    sendSimpleEmail,
    sendEmailToResetPw,
    sendNotification
}


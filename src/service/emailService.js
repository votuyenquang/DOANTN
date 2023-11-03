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
        from: 'Social Center👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Xac thuc tai khoan ✔", 

        html: `
    
        <h3>Hello  ${dataSend.receiverEmail}!</h3>
        <p>Please click on the link to verify your account </p>
        <p>
         Link: ${dataSend.redirectLink}      
        </p>
       
    
        `, 
        // <a href ="${dataSend.redirectLink}   " >Click here </a>
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
        from: '"Social Center 👻" <trungtamhotrotreem2001@gmail.com>', 
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
        from: '"Social Center 👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Thông báo nhận nuôi trẻ", 
        html: `
        <p>${dataSend.message} xin cảm ơn</p>
        `, 
    });
}
let sendEmailCreatedCenter = async(dataSend) => {
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
        from: '"Social Center 👻" <trungtamhotrotreem2001@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Account Center ✔", 
        html: `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <p>Tài khoản của bạn đã được tạo thành công </p>
        <p>Email :${dataSend.patientName} </p>
        <p>Password :${dataSend.password} </p>

        `, 
    });
}
module.exports = {
    sendSimpleEmail,
    sendEmailToResetPw,
    sendNotification,
    sendEmailCreatedCenter
}


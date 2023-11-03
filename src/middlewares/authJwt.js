const dotenv = require('dotenv'); 
const jwt = require('jsonwebtoken');
dotenv.config();

let authenToken = (req, res, next) => {
  console.log(req.headers);
    // const token = req.headers['authorization'];
   let token;
  
   if(req?.headers?.authorization.startsWith('Bearer')){
       token = req.headers.authorization.split(' ')[1] }
  
    
    if (!token) res.sendStatus(403); // khong co token
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.sendStatus(401).send({ message: "Unauthorized!" }); // khong co quyen truy cap chuc nang
          }
          req.accountID=data.id;
          req.role_name=data.role_name;
          next();
    })
}
let isAdmin = (req, res, next) => {
  console.log(req.role_name)
    if (req.role_name === 'admin') {
      next();
      return;
    }
    return res.status(403).send({ message: "Require Admin Role!" });
  }

  let isAdminOrUser =async (req,res,next) =>{
    switch (req.role_name) {
      case 'admin': {
        next();
        return;
      } case 'center': {
        next();
        return;
      }
    }
   
    console.log(req.accountID, req.params.id,req.role_name)
    if (req.accountID == req.params.id) {
      next();
      return;
    }
    return res.status(403).send({ message: "Require Admin Role!!" });
  }
  module.exports = {
    authenToken:authenToken,
    isAdmin:isAdmin,
    isAdminOrUser:isAdminOrUser

  }
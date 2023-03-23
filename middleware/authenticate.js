const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;
const userModel = require("../models/UserModel");

const athenticate = async (req, res, next) => {
    try{


        const token = req.cookies.AmazoneWeb;
        const verifyToken = jwt.verify(token, secretKey);
        console.log(verifyToken);
      
        const rootuser = await userModel.findOne({
          _id: verifyToken._id,
          "tokens.token": token,
        });
        console.log(rootuser)
      
        if (!rootuser) {
          throw new Error("user not found authniticatate.js");
        }
      
        req.token = token;
        req.rootuser = rootuser;
        req.userId = rootuser._id;
        next();


    }catch(error){
        res.status(401).json("error in authenticate.js");
        console.log(error);
    }
 
};

module.exports=athenticate;

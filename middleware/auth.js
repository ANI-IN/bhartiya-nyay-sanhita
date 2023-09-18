const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req , res, next)=> {
  const token = req.cookies.jwt;
        if (!token) {

        // No token provided, user is not authenticated
        req.isAuthenticated = false;
        return next();
        }  
  try {
    
        const verifyUser=jwt.verify(token,'grindtillyoufckit/reversethekey/asdsad');
      //  console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id})
      // console.log(user.email);
        req.isAuthenticated = true;
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        req.isAuthenticated = false;
        next();
    }
}

module.exports=auth;
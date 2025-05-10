const jwt_token = require('jsonwebtoken');
const { Response } = require("express");
require('dotenv').config();

const authenticateJWT = (req, res, next) =>{
    const token = req.cookies.token;

    if(token){
     jwt_token.verify(token, process.env.Secret_Key, (err, user) => 
    {
        if(err){
            return res.status(403).json({message : "Forbidden"});
        }
        console.log(user);
        if(!user.userId) return res.status(403).json({message : "Invalid token"});
        
        req.userId = user.userId;
       next();
    });
    }
    else{
        return res.status(401).json({message : "Unauthorised"});
    }
};

module.exports = {authenticateJWT}
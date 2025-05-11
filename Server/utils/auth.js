
const jwt_token = require('jsonwebtoken');

require('dotenv').config();


function setAuthCookie(res, userId){
    const token = jwt_token.sign({userId}, process.env.Secret_Key, {
        expiresIn : '1d'
    });

    res.cookie('token', token, {
        httpOnly : true,
        secure : false,
        sameSite : 'Lax',
        maxAge : 24*60*60*1000
    })
}

function clearAuthCookies(res){
    res.clearCookie('token', 
        {
        httpOnly : true,
        secure : false,
        sameSite : 'Lax',
        maxAge : 24*60*60*1000
        }
    );
}

module.exports = {setAuthCookie, clearAuthCookies};
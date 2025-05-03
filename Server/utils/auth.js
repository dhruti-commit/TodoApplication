
const jwt_token = require('jsonwebtoken');

const secretKey = "AuthSecret"

function setAuthCookie(res, userId){
    const token = jwt_token.sign({userId}, secretKey, {
        expiresIn : '1d'
    });

    res.cookie('token', token, {
        httpOnly : true,
        secure : false,
        sameSite : 'Lax',
        maxAge : 24*60*60*1000
    })
}

module.exports = {setAuthCookie};
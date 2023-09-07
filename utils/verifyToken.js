const jwt = require('jsonwebtoken')

const verifyToken = (token)=>{
    return jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err){
        console.log(err)
            return false
        }
        else return decoded;
    })
}

module.exports = verifyToken
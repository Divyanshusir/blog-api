const AppErr = require("../utils/AppErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isLogin = (req , res , next)=>{
    // get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedToken = verifyToken(token);
    if(!decodedToken){
        return next(AppErr('Invalid/Expired token . Please Login again' , 400)  )
    }
    else {
        req.userAuth = decodedToken.id
        next();
    }
}

module.exports = isLogin
const User = require('../model/User/users.js');
const AppErr = require('../utils/AppErr');

const isAdmin = async (req, res, next)=>{
    const user = await User.findById(req.userAuth)
    if(user){
        if(user.isAdmin){
            next();
        }else{
            return next(AppErr("Access Denied , you don't have Admin privilages." , 403));
        }
    }else{
        return next(AppErr("No User Found" , 500))
    }
}


module.exports = isAdmin
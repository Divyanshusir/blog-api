//normal AppErr function
const AppErr = (message , statusCode)=>{
    let error = new Error(message)
    error.statusCode = statusCode
    // error.stack = error.stack
    return error
}


// appErr using Error class 
class appErr extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode,
        this.status = 'Failed'
    }
}
module.exports = AppErr
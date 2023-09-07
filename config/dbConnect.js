const mongoose  = require('mongoose')

const dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('db connection established')
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
dbConnect();    
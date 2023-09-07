const mongoose = require('mongoose')
const Post = require('../Post/Post')
const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:[true , 'First Name is Required']
    },
    lastName : {
        type:String,
        required:[true , 'Last Name is Required']
    },
    profilePhoto: {
        type:String
    },
    email:{
        type:String,
        required:[true , 'Email is required']
    },
    password : {
        type:String,
        required:[true , 'Password is Required']
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum: ["Admin", "Guest" , "Editor"],
    },
    viewers:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        }
    ],
    followers:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        }
    ],
    following:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    blocked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    plan:{
            type : String ,
            enum:['Free' , 'Premium' , 'Pro'],
            default:'Free'
        },
    userAward:{
            type : String ,
            enum:['Bronze' , 'Silver' , 'Gold'],
            default:'Bronze'
        },

},{
    timestamps:true,
    toJSON: {virtuals : true}
});



userSchema.pre('findOne' , async function(next){
    this.populate({
        path:'posts'
    })
    const userid = this._conditions._id
    const posts = await Post.find({user: userid})
    const lastPost = posts[posts.length  - 1]

    const lastPostDate = new Date(lastPost?.createdAt)
    const lastPostDateStr = lastPostDate.toDateString();
    userSchema.virtual('lastPostDate').get(
        function(){
            return lastPostDateStr
        }
    )
    
    //  --------------------------check if user been active for last 30 days--------------------------
    const currentDate = new Date()
    const diff = currentDate - lastPostDate

    const diffInDays = diff/(1000*3600*24);
    console.log(diffInDays)
    
    if(diffInDays > 30){
        await User.findByIdAndUpdate(userid,
            {
                isBlocked : true
            },{
                new : true
            })

        userSchema.virtual('isInactive').get(
            function(){
                return true;
            }
        )
    }else{
        await User.findByIdAndUpdate(userid,
            {
                isBlocked : false
            },{
                new : true
            })

        userSchema.virtual('isInactive').get(
            function(){
                return false;
            }
        )
    }

    const lastActive = Math.round(diffInDays)
    userSchema.virtual('lastActive').get(
        function(){
            if(lastActive == 0){
                return 'Today';
            }
            else if(lastActive == 1){
                return 'Yesterday';
            }
            else{
                return `User was active ${lastActive} days ago.`
            }
        }
    )
    
    const numOfPost = posts.length ;
    if(numOfPost < 10){
        await User.findByIdAndUpdate(userid , {userAward : "Bronze"},{new : true});
    }
    else if(numOfPost >= 10 && numOfPost < 20){
        await User.findByIdAndUpdate(userid , {userAward : "Silver"},{new : true});
    }
    else if(numOfPost >= 20){
        await User.findByIdAndUpdate(userid , {userAward : "Gold"},{new : true});
    }
    
    next()
})


userSchema.virtual('fullName').get(
    function(){
        return `${this.firstName} ${this.lastName}`
    }
)

userSchema.virtual('initials').get(
    function(){
        return `${this.firstName[0]}${this.lastName[0]}`
    }
)

userSchema.virtual('postCount').get(
    function(){
        return this.posts.length
    }
)

userSchema.virtual('followingCount').get(
    function(){
        return this.following.length
    }
)

userSchema.virtual('followersCount').get(
    function(){
        return this.followers.length
    }
)

userSchema.virtual('viewersCount').get(
    function(){
        return this.viewers.length
    }
)

userSchema.virtual('blockedCount').get(
    function(){
        return this.blocked.length
    }
)
const User = mongoose.model('User' , userSchema );
module.exports = User

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Post Title is Required'],
        trim:true,
    },
    description:{
        type:String,
        required:[true , 'Post Description is Required']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"Post Category is required"],
    },
    numViews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }, 
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:[true , 'Author of Post is Required'],
    },
    photo:{
        type:String,
        // required:[true, 'Post Image is required'],
    },

},{
    timestamps:true,
})

const Post = mongoose.model('Post' , postSchema );
module.exports = Post 
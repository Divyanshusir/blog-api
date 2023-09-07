const Post = require("../../model/Post/Post");
const User = require("../../model/User/users");
const AppErr = require('../../utils/AppErr')

const postsCreateCntrl = async (req , res , next)=>{
    const {title , description , category }= req.body;
    try {
        const author = await User.findById(req.userAuth);
        if(author.isBlocked) return next(AppErr("Access Denied. User is Blocked" , 403))
        const postCreated = await Post.create(
            {
            title, 
            description,
            user : author._id,
            category
            }
        );
        author.posts.push(postCreated._id)
        await author.save()
        res.json({
            status:"success",
            data:postCreated
        }); 
    } catch (error) {
        return next(AppErr(error.message));
    }
}

const postsSingleCntrl = async (req , res, next)=>{
    try {
        res.json({
            status:"success",
            data:"Post route"
        });
    } catch (error) {
        res.json(error.message);
    }
}

const postsAllCntrl = async (req , res , next)=>{
    try {
        const posts = await Post.find({})
        .populate("user")
        .populate("category" , "title");

        const filteredPosts = posts.filter(post=>{
            const blockedUsers = post.user.blocked
            const isBlocked = blockedUsers.includes(req.userAuth) 

            return isBlocked ? null : post;
        })
        res.json({
            status:"success",
            data:filteredPosts
        });
    } catch (error) {
        res.json(error.message);
    }
}

const toggleLikesPostCntrl = async(req, res, next)=>{
    try {
        res.json({
            data:"success"
        })
    } catch (error) {
        return next(AppErr(error.message))
    }
}

const postsDeleteCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"delete post route"
        });
    } catch (error) {
        res.json(error.message);
    }
}

const postsUpdateCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"update posts route"
        });
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    postsCreateCntrl,
    postsSingleCntrl,
    postsAllCntrl,
    postsDeleteCntrl,
    postsUpdateCntrl,
    toggleLikesPostCntrl
} 
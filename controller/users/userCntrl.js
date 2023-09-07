const User = require('../../model/User/users.js')
const bcrypt = require('bcryptjs')
const generateToken = require('../../utils/generateToken.js')
const getTokenFromHeader = require('../../utils/getTokenFromHeader.js')
const AppErr = require('../../utils/AppErr.js')
const Post = require('../../model/Post/Post.js')
const Comment = require('../../model/Comment/Comment.js')
const Category = require('../../model/Category/Category.js')


const userRegisterCntrl = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // check if user already exists
        const userFound = await User.findOne({ email });
        if (userFound) {
            return next(AppErr('User Already Exist', 500)); 
        } else {
            // hashPassword then save the details in the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            res.json({
                status: "success",
                data: user,
            });
        }
    }catch (error) {
        return next(AppErr(error.message))
    }
};


const userLoginCntrl = async (req , res , next)=>{
    const {email , password} = req.body;
    const userFound = await User.findOne({email})
    if(!userFound){
        return next(AppErr("Wrong Login Credentials"))
    }
    const isPasswordMatched = await bcrypt.compare(password , userFound.password)
    if(!isPasswordMatched){
        return next(AppErr("Wrong Login Credentials"))
    }
    try {
        res.json({
            status:"success",
            data:{
                firstName : userFound.firstName,
                lastName:userFound.lastName,
                email:userFound.email,
                isAdmin:userFound.isAdmin,
                token:generateToken(userFound._id)
            }
        });
    } catch (error) {
        next(AppErr(error));
    }
};

const whoViewedMyProfileCntrl = async(req , res , next)=>{
    try{
        // 1.Find the original
        const user = await User.findById(req.params.id);
        //2. Find the user who viewed the original user
        const userWhoViewed = await User.findById(req.userAuth)
        // 3.Check if original and who viewed are found
        if(user && userWhoViewed){
            // 4. Check if userWhoViewed is already in the users viewers array
            const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toJSON())
            if(isUserAlreadyViewed){
                return next(AppErr("You already viewed this profile"))
            }else{
                // 5. Push the userWhoViewed to the user's viewers Array
                user.viewers.push(userWhoViewed._id);
                // 6. Save the user
                await user.save()
                res.json({
                    status:"success", 
                    data:"You have successfully viewed this Profile"
                })
            }
        }
    }catch(error){
        return next(AppErr(error.message , 500))
    }
}

const userSingleCntrl = async (req , res, next)=>{
    const id = req.userAuth
    const user = await User.findById(id)
    try {
        if(user){
            res.json({
                status:"success",
                data:user
            });
        }
        else{
            res.json({ err : "INVALID ID"})
        }
    } catch (error) {
        next(AppErr(error));
    }
}

const userAllCntrl = async (req , res, next)=>{
    try {
        const users = await User.find()
        res.json({
            status:"success",
            data:users
        });
    } catch (error) {
        next(AppErr(error));
    }
}


const userUpdateCntrl = async (req , res, next)=>{
    const {firstName , lastName , email } = req.body
    try {
        if(email){
            const emailTaken = await User.findOne({email});
            if(emailTaken){
                return next(AppErr("Email is Taken " , 400));
            }
        }

        const user = await User.findByIdAndUpdate(req.userAuth,{
            firstName,
            lastName, 
            email
        },{
            new : true,
            runValidators : true
        })

        res.json({
            status:"Success",
            data:user
        })
    } catch (err) {
        return next(AppErr(err.message, 500));
    }
}

const userPasswordUpdateCntrl = async(req , res , next)=>{
    const {password} = req.body
    try {
        if(password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password , salt);
            const user = await User.findByIdAndUpdate(req.userAuth , 
                {password : hashedPassword} , 
                {new: true , runValidators : true}
                );
    
            return res.json({
                status : "success",
                data : "Password Successfully Updated"
            })
        }else{
            return next(AppErr('Please Provide Password Field' , 400));
        }
    } catch (err) {
        return next(AppErr(err.message , 500));
    }
}

const userDeleteAccountCntrl = async(req , res , next)=>{
    try {
        //find the user to be deleted
        const userToDelete = await User.findById(req.userAuth)
        //delete all posts and comments and categories of this user
        await Post.deleteMany({user : req.userAuth})
        await Comment.deleteMany({user : req.userAuth})
        await Category.deleteMany({user : req.userAuth})

        await userToDelete.delete();

        res.json({
            status:"Success",
            data:"You have successfully deleted your account"
        })
    } catch (error) {
        return next(AppErr(error.message , 500));
    }
}

const profilePhotoUpload = async (req , res, next)=>{
    try {
        // 1. Find the user to be updated
        const userToUpdate = await User.findById(req.userAuth)
        // 2. Check if user is found
        if(!userToUpdate){
            return next(AppErr('User not found' , 403))
        }
        // 3.Check if user is Blocked
        if(userToUpdate.isBlocked){
            return next(AppErr('Action not allowed , User Account is Blocked' , 403))
        }
        // 4. Check if a user is Updating their photo
        if(req.file){
            await User.findByIdAndUpdate(req.userAuth , {
                $set:{
                    profilePhoto : req.file.path
                }
                },{
                    new: true
                }
            )
            res.json({
                status:"success",
                data:"You have successfully updated your profile photo."
            });
        }
    } catch (error) {
        next(AppErr(error.message , 500));
    }
}

const userFollowCntrl = async(req , res , next)=>{
    try{
        const currentUser = await User.findById(req.userAuth)
        // console.log(currentUser)
        const userToFollow = await User.findById(req.params.id)
        // console.log(userToFollow)
        if(currentUser && userToFollow){
            const isUserAlreadyFollowing = currentUser.following.find(user => user.toString() === userToFollow._id.toString())
            if(!isUserAlreadyFollowing){
                currentUser.following.push(userToFollow._id);
                userToFollow.followers.push(currentUser._id);

                await currentUser.save();
                await userToFollow.save();

                return res.json({
                    status : "success",
                    message : `You have successfully followed ${userToFollow.firstName} ${userToFollow.lastName}`
                })
            }else{
                return next(AppErr("You are already following the user" , 400));
            }
        }else{
            return next(AppErr("Either Current user or User to follow is missing." , 400));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

const userUnFollowCntrl = async(req , res , next)=>{
    try{
        const currentUser = await User.findById(req.userAuth)
        // console.log(currentUser)
        const userToUnFollow = await User.findById(req.params.id)
        // console.log(userToFollow)
        if(currentUser && userToUnFollow){
            const isUserAlreadyFollowing = currentUser.following.find(user => user.toString() === userToUnFollow._id.toString())
            if(isUserAlreadyFollowing){
                currentUser.following = currentUser.following.filter(
                    user=> user.toString() !== userToUnFollow._id.toString()
                )
                userToUnFollow.followers = userToUnFollow.followers.filter(
                    user=> user.toString() !== currentUser._id.toString()
                )

                await currentUser.save();
                await userToUnFollow.save();

                return res.json({
                    status : "success",
                    message : `You have successfully UnFollowed ${userToUnFollow.firstName} ${userToUnFollow.lastName}`
                })
            }else{
                return next(AppErr(`You are already not following the user  ${userToUnFollow.firstName} ${userToUnFollow.lastName}` , 400));
            }
        }else{
            return next(AppErr("Either Current user or User to Unfollow is missing." , 400));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

const userBlockCntrl = async(req , res , next)=>{
    try{
        const currentUser = await User.findById(req.userAuth)
        const userToBeBlocked = await User.findById(req.params.id)
        
        if(currentUser && userToBeBlocked){
            const isUserAlreadyBlocked = currentUser.blocked.find(user=> user.toString() === userToBeBlocked._id.toString() )
            if(!isUserAlreadyBlocked){
                currentUser.blocked.push(userToBeBlocked._id);
                await currentUser.save();
                return res.json({
                    status: "Success",
                    data:`You have Successfully Blocked ${userToBeBlocked.firstName} ${userToBeBlocked.lastName}`
                })
            }else{
                return next(AppErr(`You have already Blocked ${userToBeBlocked.firstName} ${userToBeBlocked.lastName}`))
            }
        }else{
            return next(AppErr("Either not login or user To be blocked is missing " , 400));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

const userUnBlockCntrl = async(req , res , next)=>{
    try{
        const currentUser = await User.findById(req.userAuth)
        const userToBeUnBlocked = await User.findById(req.params.id)
        
        if(currentUser && userToBeUnBlocked){
            const isUserAlreadyBlocked = currentUser.blocked.find(user=> user.toString() === userToBeUnBlocked._id.toString() )
            if(isUserAlreadyBlocked){
                currentUser.blocked = currentUser.blocked.filter(
                    user=>user.toString() !== userToBeUnBlocked._id.toString()
                )
                await currentUser.save();
                return res.json({
                    status: "Success",
                    data:`You have Successfully Unblocked ${userToBeUnBlocked.firstName} ${userToBeUnBlocked.lastName}`
                })
            }else{
                return next(AppErr(`You have not Blocked ${userToBeUnBlocked.firstName} ${userToBeUnBlocked.lastName}`))
            }
        }else{
            return next(AppErr("Either not login or user To be Unblocked is missing " , 400));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

const adminBlockUserCntrl = async(req , res , next)=>{
    try{
        const userToBeBlocked = await User.findById(req.params.id);
        if(userToBeBlocked){
            const isUserAlreadyBlocked = userToBeBlocked.isBlocked;
            if(!isUserAlreadyBlocked){
                userToBeBlocked.isBlocked = true;
                await userToBeBlocked.save();
                return res.json({
                    status:"Success",
                    data:`You have successfully Blocked ${userToBeBlocked.firstName} ${userToBeBlocked.lastName}`
                })
            }else{
                return next(AppErr("User is Already Blocked." , 400));
            }
        }else{
            return next(AppErr('User not Found' , 404));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

const adminUnBlockUserCntrl = async(req , res , next)=>{
    try{
        const userToBeUnBlocked = await User.findById(req.params.id);
        if(userToBeUnBlocked){
            const isUserAlreadyBlocked = userToBeUnBlocked.isBlocked;
            if(isUserAlreadyBlocked){
                userToBeUnBlocked.isBlocked = false;
                await userToBeUnBlocked.save();
                return res.json({
                    status:"Success",
                    data:`You have successfully Un Blocked ${userToBeUnBlocked.firstName} ${userToBeUnBlocked.lastName}`
                })
            }else{
                return next(AppErr("User is Already Unblocked." , 400));
            }
        }else{
            return next(AppErr('User not Found' , 404));
        }
    }catch(error){
        return next(AppErr(error.message , 500));
    }
}

module.exports = {
    userRegisterCntrl,
    userLoginCntrl,
    userSingleCntrl,
    userAllCntrl,
    userUpdateCntrl,
    userPasswordUpdateCntrl,
    userDeleteAccountCntrl,
    profilePhotoUpload,
    whoViewedMyProfileCntrl,
    userFollowCntrl,
    userUnFollowCntrl,
    userBlockCntrl,
    userUnBlockCntrl,
    adminBlockUserCntrl,
    adminUnBlockUserCntrl
}
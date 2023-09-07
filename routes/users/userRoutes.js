const express = require('express')
const userRouter = express.Router()
const { userRegisterCntrl , 
        userLoginCntrl , 
        userSingleCntrl , 
        userAllCntrl , 
        userUpdateCntrl , 
        userPasswordUpdateCntrl,
        userDeleteAccountCntrl,
        profilePhotoUpload , 
        whoViewedMyProfileCntrl , 
        userFollowCntrl , 
        userUnFollowCntrl, 
        userBlockCntrl,
        userUnBlockCntrl,
        adminBlockUserCntrl,
        adminUnBlockUserCntrl
    } =  require('../../controller/users/userCntrl');
const isLogin = require('../../middleware/isLogin');
const isAdmin = require('../../middleware/isAdmin');
const storage = require('../../config/cloudinary');
const multer = require('multer');

// BASE URL FOR THE ENDPOINT--------------------/api/v1/users--------------------------------
const upload = multer({storage})

userRouter.post('/register', userRegisterCntrl)

userRouter.post('/login' , userLoginCntrl);

userRouter.get('/profile' ,isLogin ,  userSingleCntrl);

userRouter.get('/' , userAllCntrl);

userRouter.delete('/' ,isLogin , userDeleteAccountCntrl);

userRouter.put('/', isLogin , userUpdateCntrl );

userRouter.put('/password-update', isLogin , userPasswordUpdateCntrl );

userRouter.post('/profile-photo-upload' ,isLogin , upload.single('profile') ,  profilePhotoUpload)

userRouter.get('/profile-viewers/:id', isLogin ,  whoViewedMyProfileCntrl);

userRouter.get('/follow/:id' , isLogin , userFollowCntrl);

userRouter.get('/unfollow/:id' , isLogin , userUnFollowCntrl);

userRouter.get('/block/:id' , isLogin , userBlockCntrl);

userRouter.get('/unBlock/:id' , isLogin , userUnBlockCntrl);

userRouter.put('/admin-block/:id' , isLogin , isAdmin , adminBlockUserCntrl); 

userRouter.put('/admin-unblock/:id' , isLogin , isAdmin , adminUnBlockUserCntrl); 

module.exports = userRouter
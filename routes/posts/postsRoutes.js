const express  = require('express');
const postsRouter = express.Router()
const { postsCreateCntrl , postsSingleCntrl , postsAllCntrl, toggleLikesPostCntrl , postsDeleteCntrl , postsUpdateCntrl} = require('../../controller/posts/postsCntrl');
const isLogin = require('../../middleware/isLogin')
// BASE URL FOR THE ENDPOINT--------------------/api/v1/posts--------------------------------

postsRouter.post('/' ,isLogin , postsCreateCntrl);

postsRouter.get('/:id' , postsSingleCntrl);

postsRouter.get('/' ,isLogin , postsAllCntrl);

postsRouter.get('/likes/:id' ,isLogin , toggleLikesPostCntrl);

postsRouter.delete('/:id' , postsDeleteCntrl);

postsRouter.put('/:id' , postsUpdateCntrl);

module.exports = postsRouter 
const express = require('express')
require('dotenv').config()
const userRouter = require('./routes/users/userRoutes.js')
const postsRouter = require('./routes/posts/postsRoutes.js')
const commentsRouter = require('./routes/comments/commentsRoutes.js')
const categoriesRouter = require('./routes/categories/categoriesRoutes.js')
const globalErrHandler = require('./middleware/globalErrHandler.js')

require('./config/dbConnect')

const app = express()

//---------------------------------------------------- middlewares----------------------------------------
app.use(express.json())

// -----------------------------------------------------Routes--------------------------------------------

//---------------------// user routes-----------
app.use('/api/v1/users' , userRouter);


//---------------------// posts routes-----------
app.use('/api/v1/posts' , postsRouter);


//---------------------// COMMENT routes---------
app.use('/api/v1/comments' , commentsRouter);


//---------------------// CATEGORIES routes------
app.use('/api/v1/categories' , categoriesRouter);


//------------------------------------------------------- error handler---------------------------------
app.use(globalErrHandler);

// 404 error handler
app.use('*' , (req , res)=>{
    res.status(404).json({
        message : `${req.originalUrl} - Route not Found . Please check it`
    })
})
app.listen( process.env.PORT , console.log(`server is running at port ${process.env.PORT}`))    
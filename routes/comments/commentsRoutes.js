const express = require('express');
const { commentsCreateCntrl , commentsSingleCntrl, commentsDeleteCntrl , commentsUpdateCntrl } = require('../../controller/comments/commentsCntrl');
const commentsRouter = express.Router();
// BASE URL FOR THE ENDPOINT--------------------/api/v1/comments--------------------------------

commentsRouter.post('/' , commentsCreateCntrl);

commentsRouter.get('/:id' , commentsSingleCntrl);

commentsRouter.delete('/:id' , commentsDeleteCntrl );

commentsRouter.put('/:id' , commentsUpdateCntrl );

module.exports = commentsRouter;
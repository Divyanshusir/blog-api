const commentsCreateCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"comment created"
        });
    } catch (error) {
        res.json(error.message);
    }
}

const commentsSingleCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"comment route"
        });
    } catch (error) {
        res.json(error.message);
    }
}

const commentsDeleteCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"delete comment route"
        });
    } catch (error) {
        res.json(error.message);
    }
} 

const commentsUpdateCntrl = async (req , res)=>{
    try {
        res.json({
            status:"success",
            data:"update comment route"
        });
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    commentsCreateCntrl,
    commentsSingleCntrl,
    commentsDeleteCntrl,
    commentsUpdateCntrl
}
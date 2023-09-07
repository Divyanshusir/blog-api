const Category = require("../../model/Category/Category");
const AppErr = require('../../utils/AppErr')

const categoriesInsertCntrl = async (req , res , next)=>{
    const {title} = req.body
    try {
        const category = await Category.create({
            user : req.userAuth,
            title : title
        })
        res.json({
            status : "Success",
            data : category
        })
    } catch (error) {
        return next(AppErr(error.message));
    }
}

const categoriesAllFetchCntrl = async(req , res , next)=>{
    try {
        const allCategories = await Category.find()
        res.json({
            status:"Success",
            data: allCategories
        })
    } catch (error) {
        return next(AppErr(error.message));
    }
}

const categoriesSingleCntrl = async (req , res , next)=>{
    try {
        const categoryFetched = await Category.findById(req.params.id)
        if(!categoryFetched){
            return next(AppErr("Wrong category id , Please recheck" , 400))
        }
        res.json({
            status:"success",
            data:categoryFetched
        });
    } catch (error) {
        return next(AppErr(error.message)) ;
    }
}

const categoriesDeleteCntrl = async (req , res , next)=>{
    try {
        await Category.deleteOne({_id : req.params.id})
        res.json({
            status:"success",
            data:"Category successfully deleted."
        });
    } catch (error) {
        return next(AppErr(error.message));
    }
}

const categoriesUpdateCntrl = async (req , res , next)=>{
    const {title} = req.body
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id , {
            title : title
        } , {
            new : true,
            runValidators : true
        })
        res.json({
            status:"success",
            data:updatedCategory
        });
    } catch (error) {
        return next(AppErr(error.message));
    }
}

module.exports = {
    categoriesInsertCntrl,
    categoriesAllFetchCntrl,
    categoriesSingleCntrl,
    categoriesDeleteCntrl,
    categoriesUpdateCntrl
} 
const express = require('express')
const categoriesRouter = express.Router();
const isLogin = require('../../middleware/isLogin')
const {categoriesInsertCntrl ,categoriesAllFetchCntrl ,  categoriesSingleCntrl , categoriesDeleteCntrl , categoriesUpdateCntrl} = require('../../controller/categories/categoriesCntrl.js')
// BASE URL FOR THE ENDPOINT--------------------/api/v1/categories--------------------------------

categoriesRouter.post('/' , isLogin , categoriesInsertCntrl);

categoriesRouter.get('/'  , categoriesAllFetchCntrl);

categoriesRouter.get('/:id' , categoriesSingleCntrl);

categoriesRouter.delete('/:id' , isLogin , categoriesDeleteCntrl);

categoriesRouter.put('/:id' , isLogin , categoriesUpdateCntrl);


module.exports = categoriesRouter; 
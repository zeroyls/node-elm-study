'use strict';

import BaseComponent from '../../prototype/baseComponent';
import CategoryModel from '../../models/shopping/category';


class Category extends BaseComponent{
    constructor(){
        super()
    }

    async addCategory(type){
		try{
			await CategoryModel.addCategory(type)
		}catch(err){
			console.log('增加category数量失败', err);
		}
	}

    //获取所有餐馆分类和数量
    async listCategory(req, res, next){
        let responseData;
        try{
            const categories = await CategoryModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                categories
            }
        }catch(err ){
            responseData = {
                error_code: 4005,
                error_type: 'GET_CATEGORY_ERROR'
            }
        }
        res.data = responseData;
        next();
    }




}

export default new Category()
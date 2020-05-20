'use strict';

import BaseComponent from '../../prototype/baseComponent';
import ActivityModel from '../../models/shopping/activity';
import DeliveryModel from '../../models/shopping/delivery';
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
    async getCategories(req, res, next){
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

    //获取配送方式
    async getDelivery(req, res, next){
        let responseData;
        try{
            const deliveries = await DeliveryModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                deliveries
            }
        }catch(err ){
            responseData = {
                error_code: 4004,
                error_type: 'GET_DELIVERY_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    //获取活动列表
    async getActivity(req, res, next){
        let responseData;
        try{
            const activities = await ActivityModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                activities
            }
        }catch(err ){
            responseData = {
                error_code: 4003,
                error_type: 'GET_ACTIVITY_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Category()
'use strict';

import AddressComponent from "../../prototype/addressComponent";
import ShopModel from "../../models/shopping/shop";
import CategoryController from './category';
import FoodController from './food';
import RatingController from './rating';

const debug = require("debug")("node-elm:shopController")

class Shop extends AddressComponent{
    constructor(){
        super();
        this.addShop = this.addShop.bind(this);
    }

    //添加商铺
    async addShop(req, res, next){
        let restaurant_id;
        let responseData;
        try{
            restaurant_id = await this.getId('restaurant_id');
        }catch(err ){
            debug("Error in addShop api:\n %o ", err);
            responseData = {
                error_code: 4006,
                error_type: "ADD_SHOP_ERROR"
            }
            res.data = responseData;
            next();
            return;
        }
        const {name, address, phone, latitude, longitude, image_path, category} = req.body;
        try{
            if(!name){
                throw new Error('必须填写商店名称');
            }else if(!address ){
                throw new Error('必须填写商店地址');
            }else if(!phone){
                throw new Error('必须填写联系电话');
            }else if(!latitude || !longitude){
                throw new Error('商店位置信息错误');
            }else if(!image_path){
                throw new Error('必须上传商铺图片');
            }else if(!category ){
                throw new Error('必须填写食品种类')
            }
        }catch(err ){
            debug("Error in addShop api:\n %o ", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        const exists = await ShopModel.findOne({name:name});
        if(exists){
            debug("Error in addShop api: shop has exsit");
            responseData = {
                error_code: 4007,
                error_type: 'RESTURANT_EXISTS'
            }
            res.data = responseData;
            next();
            return;
        }

        const {startTime, endTime, description, float_delivery_fee, float_minimum_order_amount, is_premium, is_new, promotion_info, business_license_image, catering_service_license_image} = req.body;
        const opening_hours = startTime && endTime ? startTime + '/' + endTime : "8:30/20:30";
        const newShop = {
            name,
            address,
            description: description || '',
            float_delivery_fee: float_delivery_fee || 0,
            float_minimum_order_amount: float_minimum_order_amount || 0,
            id: restaurant_id,
            is_premium: is_premium || false,
            is_new: is_new || false,
            location: [longitude, latitude],
            opening_hours: [opening_hours],
            phone: phone,
            promotion_info: promotion_info || "欢迎光临，用餐高峰请提前下单，谢谢",
            rating: (4 + Math.random()).toFixed(1),
            rating_count: Math.ceil(Math.random()*1000),
            recent_order_num: Math.ceil(Math.random()*1000),
            status: Math.round(Math.random()),
            image_path,
            category,
            piecewise_agent_fee: {
                tips: "配送费约¥" + (float_delivery_fee || 0),
            },
            activities: [],
            supports: [],
            license: {
                business_license_image: business_license_image || '',
                catering_service_license_image: catering_service_license_image || '',
            },
            identification: {
                company_name: "",
                identificate_agency: "",
                identificate_date: "",
                legal_person: "",
                licenses_date: "",
                licenses_number: "",
                licenses_scope: "",
                operation_period: "",
                registered_address: "",
                registered_number: "",
            },
        }
        
        try{
            const shop = new ShopModel(newShop);
            await shop.save();
            CategoryController.addCategory(category);
            RatingController.initData(restaurant_id);
            FoodController.initData(restaurant_id);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                shopDetail: newShop
            }
        }catch(err ){
            debug("Error in addShop api:\n %o ", err);
            responseData = {
                error_code: 4006,
                error_type: "ADD_SHOP_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    //获取餐馆列表
    async getRestaurants(req, res, next){
        let responseData;
        const {
            latitude,
            longitude,
            offset = 0,
            limit = 20,
            keyword,
            restaurant_category_id,
            order_by,
            extras,
            delivery_mode = [],
            support_ids = [],
            restaurant_category_ids = []    
        } = req.query;

        try{
            if(!latitude){
                throw new Error('latitude参数错误')
            }else if(!longitude){
                throw new Error('longitude参数错误')
            }
        }catch(err ){
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return; 
        }

        const restaurants = await ShopModel.find().limit(Number(limit)).skip(Number(offset))
        const from = latitude + "," + longitude;
        let to = '' ;
        restaurants.forEach((item, index) => {
            const splitStr = (index == restaurants.length - 1) ? '': '|';
            to += item.latitude + ',' + item.longitude + splitStr;
        })

        try{
            if(restaurants.length){
                const distance_duration = await this.getDistance(from, to)
                restaurants.map((item, index)=> {
                    return Object.assign(item, distance_duration[index])
                })
            }
        }catch(err ){
            restaurants.map((item, index) => {
                return Object.assign(item, {
                    distance: '10公里', order_lear_time: '40分钟'
                })
            })
        }

        responseData = {
            error_code: 0,
            error_type: 'ERROR_OK',
            restaurants
        }
        res.data = responseData;
        
        next();

    }
}

export default new Shop()
'use strict';

import AddressComponent from "../../prototype/addressComponent";
import ShopModel from "../../models/shopping/shop";

class Shop extends AddressComponent{
    constructor(){
        super();
        
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
'use strict';

import {FoodModel, MenuModel} from '../../models/shopping/food';
import BaseComponent from '../../prototype/baseComponent';
const debug = require('debug')('node-elm:foodController');

// 对于一个商铺里的食品操作
// 是需要admin 权限的
class Food extends BaseComponent{
    constructor(){
        super();
        this.defaultMenuData = [
            {
                name: '热销榜',
                description: '大家喜欢吃，才叫真好吃',
                icon_url: '5da3872d782f707b4c82ce4607c73d1ajpeg',
                is_selected: true,
                type: 1,
                foods: [],
            },{
                name: '优惠',
                description: '美味又实惠, 大家快来抢!', 
                icon_url: "4735c4342691749b8e1a531149a46117jpeg",
                type: 1,
                foods: [],
            }
        ]
        this.initData = this.initData.bind(this);
        this.addMenu = this.addMenu.bind(this);
        this.addFood = this.addFood.bind(this);
    }

    //在添加商铺时，初始化商铺的食物分类和食物列表
    async initData(restaurant_id){
        for(let i = 0; i < this.defaultMenuData.length; i++){
            let menu_id;
            try{
                menu_id = await this.getId('menu_id');
            }catch(err ){
                throw new Error(err);
            }
            const defaultMenuData = this.defaultMenuData[i];
            const menuObj = {...defaultMenuData, id: menu_id, restaurant_id};
            const newMenu = new MenuModel(menuObj);
            try{
                await newMenu.save();

            }catch(err ){
                throw new Error(err);
            }
        }
    }

    //添加商铺内的食品种类，即Menu
    async addMenu(req, res, next){
        let responseData;
        const {restaurant_id, name} = req.body;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }else if(!name){
                throw new Error('必须填写食品类型名称');
            }
        }catch(err ){
            debug("Error in addMenu api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        let menu_id;
        try{
            menu_id = await this.getId('menu_id');
        }catch(err ){
            debug("Error in addMenu api:\n %o", err);
            responseData = {
                error_code: 4008,
                error_type: 'ADD_MENU_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        const {description} = req.body;
        const menuObj = {
            name,
            description: description || '',
            restaurant_id,
            id: menu_id,
            foods: []
        }

        const newMenu = new MenuModel(menuObj);
        try{
            await newMenu.save();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                menuObj
            }
        }catch(err ){
            debug("Error in addMenu api:\n %o", err);
            responseData = {
                error_code: 4008,
                error_type: 'ADD_MENU_ERROR'
            }
        }
        res.data = responseData;
        next();
    }


    // TODO: spec 食品添加

    async addFood(req, res, next){
        let responseData;
        const {restaurant_id, menu_id, name, image_path} = req.body;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }else if(!menu_id){
                throw new Error('食品类型ID错误');
            }else if(!name){
                throw new Error('必须填写食品名称');    
            }else if(!image_path){
                throw new Error('必须上传食品图片');
            }
        }catch(err ){
            debug("Error in addFood api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        let menu;
        try{
            menu = await MenuModel.findOne({id: menu_id});
        }catch(err ){
            debug("Error in addFood api:\n %o", err);
            responseData = {
                error_code: 4009,
                error_type: 'ADD_FOOD_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        let item_id;
        try{
            item_id = await this.getId('item_id');  
        }catch(err ){
            debug("Error in addFood api:\n %o", err);
            responseData = {
                error_code: 4009,
                error_type: 'ADD_FOOD_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        const rating_count = Math.ceil(Math.random() * 1000);
        const month_sales = Math.ceil(Math.random() * 1000);
        const tips = rating_count + "评价 月售" + month_sales + "份";
        const {description, activity, attributes } = req.body;
        const newFoodObj = {
            name,
            description: description || "",
            image_path,
            activity: null,
            attributes: [],
            restaurant_id,
            menu_id,
            satisfy_rate: Math.ceil(Math.random() * 100),
            satisfy_count: Math.ceil(Math.random() * 1000),
            item_id,
            rating: (4 + Math.random()).toFixed(1),
            rating_count,
            month_sales,
            tips,
            specfoods: [],
            specifications: []
        }

        if(activity){
            newFoodObj.activity = {
                image_text_color: 'f1884f',
                icon_color: 'f07373',
                image_text: activity
            }
        }

        if(attributes && attributes.length){
            attributes.forEach(item => {
                let attr;
                switch(item){
                    case '新':
                        attr = {
                            icon_color: '5ec452',
                            icon_name: '新'
                        }
                        break;
                    case '招牌': 
                        attr = {
                            icon_color: 'f07373',
                            icon_name: '招牌'
                        }
                        break;
                }
                newFoodObj.attributes.push(attr);
            });
        }

        try{
            const foodEntity = await FoodModel.create(newFoodObj);
            menu.foods.push(foodEntity);
            menu.markModified('foods');
            await menu.save();
            responseData = {
                error_code: 0,
                error_type: "ERROR_OK",
                newFoodObj
            }
        }catch(err ){
            debug("Error in addFood api:\n %o", err);
            responseData = {
                error_code: 4009,
                error_type: 'ADD_FOOD_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    // TODO: spec 食品修改
    async updateFood(req, res, next){
        let responseData;
        const {item_id, name, description = "", image_path,  new_menu_id} = req.body;
        try{
            if(!item_id){
                throw new Error('食品ID错误');  
            }
            if(!name && !description && !image_path && new_menu_id){
                throw new Error('无食品信息修改')
            }
        }catch(err){
            debug("Error in updateFood api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
        }

        try{
            let newFoodData = {name, description, image_path};
            let food = await FoodModel.findOne({item_id});
            const menu_id = food.menu_id;
            const menu = await MenuModel.findOne({id: menu_id});
            if(Number(new_menu_id) && menu_id != new_menu_id){
                newFoodData.menu_id = new_menu_id;
                food = await FoodModel.findOneAndUpdate({item_id}, {$set: newFoodData});
                const new_menu = await MenuModel.findOne({id: new_menu_id});
                let subFood = menu.foods.id(food._id);
                subFood.set(newFoodData);
                new_menu.foods.push(subFood);
                new_menu.markModified('foods');
                await new_menu.save();
                await subFood.remove();
                await menu.save();
            }else{
                food = await FoodModel.findOneAndUpdate({item_id}, {$set: newFoodData});
                let subFood = menu.foods.id(food._id);
                subFood.set(newFoodData);
                await menu.save();
            }

            responseData = {
                error_code: 0,
                error_type: "ERROR_OK",
                food
            }
        }catch(err ){
            debug("Error in updateFood api:\n %o", err);
            responseData = {
                error_code: 4012,
                error_type: 'UPDATE_FOOD_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async listFoods(req, res, next){
        let responseData;
        const {restaurant_id, limit = 20, offset = 0} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getFoods api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            let filter = {};
            if(restaurant_id && Number(restaurant_id)){
                filter = { restaurant_id}
            }

            const foods = await FoodModel.find(filter, '-id').sort({item_id: -1}).limit(Number(limit)).skip(Number(offset));
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                foods
            }
        }catch(err ){
            debug("Error in getFoods api:\n %o", err);
            responseData = {
                error_code: 4010,
                error_type: 'GET_FOODS_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async getFoodsCount(req, res, next){
        let responseData;
        const {restaurant_id} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getFoodsCount api: \n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const count = await FoodModel.find({restaurant_id}).count();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                count
            }
        }catch(err){
            debug("Error in getFoodsCount api: \n %o", err);
            responseData = {
                error_code: 4013,
                error_type: 'GET_FOODS_COUNT_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async deleteFood(req, res, next){
        let responseData;
        const {food_id} = req.body;
        try{
            if(!food_id){
                throw new Error('食品ID错误')
            }
        }catch(err ){
            debug("Error in deleteFood api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const food = await FoodModel.findOne({item_id: food_id});
            const menu = await MenuModel.findOne({id: food.menu_id});
            let subFood = menu.foods.id(food._id);
            await subFood.remove();
            await menu.save();
            await food.remove();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                item_id: food_id
            }
        }catch(err ){
            debug("Error in deleteFood api:\n %o", err);
            responseData = {
                error_code: 4011,
                error_type: 'DELETE_FOOD_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Food()
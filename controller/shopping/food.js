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
}

export default new Food()
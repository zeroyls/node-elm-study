'use strict';

import {Food as FoodModel, Menu as MenuModel} from '../../models/shopping/food';
import BaseComponent from '../../prototype/baseComponent';

class Food extends BaseComponent{
    constructor(){
        super();
        this.defaultData = [
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
    }

    //在添加商铺时，初始化商铺的食物分类和食物列表
    async initData(restaurant_id){
        for(let i = 0; i < this.defaultData.length; i++){
            let category_id;
            try{
                category_id = await this.getId('category_id');
            }catch(err ){
                throw new Error(err);
            }
            const defaultData = this.defaultData[i];
            const Category = {...defaultData, id: category_id, restaurant_id};
            const newFood = new MenuModel(Category);
            try{
                await newFood.save();

            }catch(err ){
                throw new Error(err);
            }
        }
    }
}

export default new Food()
'use strict';

import mongoose from 'mongoose';
import cityData from '../../InitData/cities'

const citySchema = new mongoose.Schema({
    data: {}
})

// 根据城市名精确查找
citySchema.statics.cityGuess = function(name){
    return new Promise(async (resolve, reject) => {
        const firstWord = name.substr(0, 1).toUpperCase();
        try{
            const city = await this.findOne();
            //item: [key, value]
            Object.entries(city.data).forEach(item => {
                if(item[0] == firstWord){//item[0]为key
                    item[1].forEach(cityItem => {
                        if(cityItem.pinyin == name){//精确匹配
                            resolve(cityItem);
                        }
                    })
                }
            })
        }catch(err){
            reject({            
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            })
        }
    })
}

citySchema.statics.cityHot = function(){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            resolve(city.data.hotCities);
        }catch(err){
            reject({            
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            })
        }
    })
}

citySchema.statics.cityGroup = function(){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            const cityObj = city.data;
            delete(cityObj._id);
            delete(cityObj.hotCities);
            resolve(cityObj);
        }catch(err){
            reject({            
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            })
        }
    })
}

citySchema.statics.getCityById = function(id){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            Object.entries(city.data).forEach(item => {
                if(item[0] !== '_id' && item[0] !== 'hotCities'){
                    item[1].forEach(cityItem => {
                        if(cityItem.id == id){
                            resolve(cityItem)
                        }
                    })
                }
            })
        }catch(err){
            reject({            
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            })
        }
    })
}

const CityModel = mongoose.model('Cities', citySchema);

CityModel.findOne((err, data) => {
    if(!data){
        CityModel.create({
            data: cityData
        })
    }
})

export default CityModel;
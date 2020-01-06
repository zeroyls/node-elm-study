'use strict';

import mongoose from 'mongoose';
import cityData from '../../InitData/cities'

const citySchema = new mongoose.Schema({
    data: {}
})


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
                message:'查找数据失败'
            })
            console.error(err);
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
                name: "ERROR_DATA",
                message: "查找数据失败"
            })
            console.log(err);
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
                message:"查找数据失败"
            })
            console.error(err);
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
                message: '查找数据失败'
            });
            console.error(err);
        }
    })
}

const CityModel = mongoose.model('Cities', citySchema);

CityModel.findOne((err, data) => {
    if(!data){
        Cities.create({
            data: cityData
        })
    }
})

export default CityModel;
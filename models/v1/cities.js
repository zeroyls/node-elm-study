'use strict';

import mongoose from 'mongoose';
import cityData from '../../InitData/cities'

const citySchema = new mongoose.Schema({
    data: {}
})

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

const Cities = mongoose.model('Cities', citySchema);

Cities.findOne((err, data) => {
    if(!data){
        Cities.create({
            data: cityData
        })
    }
})

export default Cities;
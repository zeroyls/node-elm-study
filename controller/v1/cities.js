'use strict';

import CityModel from '../../models/v1/cities';
import AdressComponent from '../../prototype/addressComponent';
import pinyin from 'pinyin';

class CityController extends AdressComponent{
    constructor(){
        super();
        this.getCity = this.getCity.bind(this);
    }

    async getCity(req, res, next){
        const type = req.query.type;
        let cityInfo;
        try{
            switch(type){
                case 'guess':
                    //通过req里的ip 查到所在地的城市拼音
                    const city = await this.getCityName(req);
                    // 通过拼音查到具体的信息
                    cityInfo = await CityModel.cityGuess(city);
                    break;
                case 'hot':
                    cityInfo = await CityModel.cityHot();
                    break;
                case 'group':
                    cityInfo = await CityModel.cityGroup();
                    break;
                default:
                    res.send({
                        message: '参数错误'
                    })
                    return
            }
            res.send(cityInfo);
        }catch(err){
            res.send({
                message:'获取数据失败'
            })
        }
    }

    async getCityById(req, res, next){
        const cityid = req.params.id;
        if(isNaN(cityid)){
            res.send({
                message: '参数错误'
            })
            return
        }
        try{
            const cityInfo = await CityModel.getCityById(cityid);
            res.send(cityInfo);
        }catch(err){
            res.send({
                message:'获取数据失败'
            })
        }
    }

    async getCityName(req){
        try{
            const cityInfo = await this.guessPosition(req);
            const pinyinArr = pinyin(cityInfo.city, {
                style: pinyin.STYLE_NORMAL
            })
            console.log(pinyinArr);
            let cityName = '';
            pinyinArr.forEach(item => {
                cityName += item[0];
            })
            return cityName;
        }catch(err){
            return '北京'
        }
    }
}

export default new CityController()
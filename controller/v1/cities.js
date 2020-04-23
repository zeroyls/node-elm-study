'use strict';

import CityModel from '../../models/v1/cities';
import AdressComponent from '../../prototype/addressComponent';
import pinyin from 'pinyin';

class CityController extends AdressComponent{
    constructor(){
        super();
        this.getCity = this.getCity.bind(this);
        this.getExactAddress = this.getExactAddress.bind(this);
        this.pois = this.pois.bind(this);
    }

    async getCity(req, res, next){
        const type = req.query.type;
        let cityInfo;
        let responseData;
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
                    break;
            }

            if(cityInfo){
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK',
                    cityInfo
                }
            }else{
                responseData = {
                    error_code: 1000,
                    error_type: 'REQUEST_DATA_ERROR'
                }
            }
        }catch(err){
            responseData = {
                error_code: 4001,
                error_type: 'CITY_GET_ERROR'
            }
        }
        res.data = responseData;
        next();
        return; 
    }

    async getCityById(req, res, next){
        const cityid = req.params.id;
        let responseData;
        if(isNaN(cityid)){
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }
        try{
            const cityInfo = await CityModel.getCityById(cityid);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                cityInfo
            }
        }catch(err){
            responseData = {
                error_code: 4001,
                error_type: 'CITY_GET_ERROR'
            }
        }
        res.data = responseData;
        next();
        return;
    }

    async getCityName(req){
        try{
            const cityInfo = await this.guessPosition(req);
            const pinyinArr = pinyin(cityInfo.city, {
                style: pinyin.STYLE_NORMAL
            })
            let cityName = '';
            pinyinArr.forEach(item => {
                cityName += item[0];
            })
            return cityName;
        }catch(err){
            return '北京'
        }
    }

    async getExactAddress(req, res, next) {
        let responseData;
        try{
            const position = await this.geocoder(req)
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                position
            }
        }catch(err){
            responseData = {
                error_code: 4001,
                error_type: 'CITY_GET_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async pois(req, res, next){
        let responseData;
        try{
            const geohash = req.params.geohash || '';
            if(geohash.indexOf(',') == -1){
                responseData = {
                    error_code: 1000,
                    error_type: 'REQUEST_DATA_ERROR'
                }
                res.data = responseData;
                next();
                return;
            }

            const poisArr = geohash.split(',');
            const result = await this.getpois(poisArr[0], poisArr[1]);
            const address = {
                adress: result.result.address,
                city: result.result.address_component.province,
                geohash,
                latitude: poisArr[0],
                longtitude: poisArr[1],
                name: result.result.formatted_address.recommend
            }
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                address
            }
            
        }catch(err){
            responseData = {
                error_code: 4001,
                error_type: 'CITY_GET_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new CityController()
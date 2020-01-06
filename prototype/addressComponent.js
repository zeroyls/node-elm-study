'use strict';
import BaseComponent from './baseComponent'

export default class AddressComponent extends BaseComponent{
    constructor(){
        super();
        this.tencentkey = 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL';
		this.tencentkey2 = 'RRXBZ-WC6KF-ZQSJT-N2QU7-T5QIT-6KF5X';
		this.tencentkey3 = 'OHTBZ-7IFRG-JG2QF-IHFUK-XTTK6-VXFBN';
		this.tencentkey4 = 'Z2BBZ-QBSKJ-DFUFG-FDGT3-4JRYV-JKF5O';
    }

    //根据请求的ip获取所在的城市
    async guessPosition(req){
        return new Promise(async (resolve, reject) => {
            let ip;
            const defaultIp = '180.158.102.141';
            if(process.env.NODE_ENV == 'development'){
                ip = defaultIp;
            }else{
                try{
                    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                    const ipAddr = ip.split(':');
                    ip = ipArr[ipAddr.length - 1] || defaultIp;
                }catch(err){
                    ip = defaultIp;
                }
            }
            try{
                let result = await this.fetch('http://apis.map.qq.com/ws/loaction/v1/ip', {
                    ip,
                    key: this.tencentkey
                });
                if (result.status != 0) {
                    result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
                        ip,
                        key: this.tencentkey2,
                    })
                }
                if (result.status != 0) {
                    result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
                        ip,
                        key: this.tencentkey3,
                    })
                }
                if (result.status != 0) {
                    result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
                        ip,
                        key: this.tencentkey4,
                    })
                }

                if(result.status == 0){
                    const cityInfo = {
                        lat: result.result.location.lat,
                        lng: result.result.location.lng,
                        city: result.result.ad_info.city
                    }
                    cityInfo.city = cityInfo.city.replace(/市$/, '');
                    resolve(cityInfo);
                }else{
                    reject('定位失败')
                }
            }catch(err){
                reject(err);
                console.error(err);
            }
        })
    }

    //根据关键词和城市名查找地址
    async searchPlace(keyword, cityName){
        try{
            const resObj = await this.fetch('http://apis.map.qq.com/ws/place/v1/search', {
                key: this.tencentkey,
                keyword: encodeURIComponent(keyword),
                boundary: 'region(' + encodeURIComponent(cityName) + ',0)',
                page_size: 10   
            });
            if(resObj.status == 0){
                return resObj
            }else{
                throw new Error('搜素位置信息失败');
            }
        }catch(err){
            throw new Error(err);
        }
    }
}
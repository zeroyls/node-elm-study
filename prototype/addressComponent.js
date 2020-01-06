'use strict';
import BaseComponent from './baseComponent'

export default class AddressComponent extends BaseComponent{
    constructor(){
        super();
        this.tencentkey = 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL';
		this.tencentkey2 = 'RRXBZ-WC6KF-ZQSJT-N2QU7-T5QIT-6KF5X';
		this.tencentkey3 = 'OHTBZ-7IFRG-JG2QF-IHFUK-XTTK6-VXFBN';
        this.tencentkey4 = 'Z2BBZ-QBSKJ-DFUFG-FDGT3-4JRYV-JKF5O';
        this.baidukey = 'fjke3YUipM9N64GdOIh1DNeK2APO2WcT';
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

    	//测量距离
	async getDistance(from, to, type){
		try{
			let res
			res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
				ak: this.baidukey,
				output: 'json',
				origins: from,
				destinations: to,
			})
			// if(res.status !== 0){
			// 	res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
			// 		ak: this.baidukey2,
			// 		output: 'json',
			// 		origins: from,
			// 		destinations: to,
			// 	})
			// }
			if(res.status == 0){
				const positionArr = [];
				let timevalue;
				res.result.forEach(item => {
					timevalue = parseInt(item.duration.value) + 1200;
					let durationtime = Math.ceil(timevalue%3600/60) + '分钟';
					if(Math.floor(timevalue/3600)){
						durationtime = Math.floor(timevalue/3600) + '小时' + durationtime;
					}
					positionArr.push({
						distance: item.distance.text,
						order_lead_time: durationtime,
					})
				})
				if (type == 'tiemvalue') {
					return timevalue
				}else{
					return positionArr
				}
			}else{
				if (type == 'tiemvalue') {
					return 2000;
				} else {
					throw new Error('调用百度地图测距失败');
				}
			}
		}catch(err){
            console.log(err);
			console.log('获取位置距离失败');
			throw new Error(err);
		}
	}
}
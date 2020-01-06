import AddressComponent from '../../prototype/addressComponent';
import CityModel from '../../models/v1/cities';
import CityController from './cities'

class SearchController extends AddressComponent{
    constructor(){
        super();
        this.search = this.search.bind(this);
    }

    async search(req, res, next){
        let {city_id, keyword} = req.query;
        if(!keyword){
            res.send({
                message:'参数错误',
            });
            return
        }else if(isNaN(city_id)){
            try{
                //根据请求的ip获取城市名
                const cityname = await CityController.getCityName(req);
                const cityInfo = await CityModel.cityGuess(cityname);
                city_id = cityInfo.id;
            }catch(err){
                res.send({
                    message: '获取数据失败'
                })
            };
        }
        try{
			const cityInfo = await CityModel.getCityById(city_id);
			const resObj = await this.searchPlace(keyword, cityInfo.name);
			const cityList = [];
			resObj.data.forEach((item, index) => {
				cityList.push({
					name: item.title,
					address: item.address,
					latitude: item.location.lat,
					longitude: item.location.lng,
					geohash: item.location.lat + ',' + item.location.lng,
				})
			});
			res.send(cityList);
		}catch(err){
            console.log(err)
			res.send({
				name: 'GET_ADDRESS_ERROR',
				message: '获取地址信息失败',
			});
		}
    }
}

export default new SearchController();
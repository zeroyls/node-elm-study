'use strict';

import cities from '../../models/v1/cities'

class CityHandle{
    constructor(){
        this.getCity = this.getCity.bind(this);
    }

    async getCity(req, res, next){
        let cityInfo;
        cityInfo = await cities.cityHot();
        res.send(cityInfo);
    }
}

export default new CityHandle()
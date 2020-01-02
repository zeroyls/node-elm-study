'use strict';

class CityHandle{
    constructor(){
        this.getCity = this.getCity.bind(this);
    }

    getCity(req, res, next){
        res.send("get city");
    }
}

export default new CityHandle()
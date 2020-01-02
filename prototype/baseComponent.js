'use strict';

import Ids from '../models/ids';

export default class BaseComponent{
    constructor(){
        this.idList = ['admin_id'];
    }

    async getId(type){
        if(!this.idList.includes(type)){
            throw new Error('id类型错误');
            return
        }
        try{
            const idData = await Ids.findOne();
            idData[type] ++;
            await idData.save();
            return idData[type];
        }catch(err){
            throw new Error(err);
        }
    }
}
'use strict';

import BaseComponent from '../../prototype/baseComponent';
import ActivityModel from '../../models/shopping/activity';

class Category extends BaseComponent{
    constructor(){
        super()
    }

    //获取活动列表
    async getActivity(req, res, next){
        let responseData;
        try{
            const activities = await ActivityModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                activities
            }
        }catch(err ){
            responseData = {
                error_code: 4003,
                error_type: 'GET_ACTIVITY_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Category()
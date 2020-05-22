'use strict';

import ActivityModel from '../../models/shopping/activity';

class Activity {
    //获取活动列表
    async listActivity(req, res, next){
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

export default new Activity()
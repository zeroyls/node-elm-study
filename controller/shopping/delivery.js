'use strict';

import DeliveryModel from '../../models/shopping/delivery';

class Delivery{

    //获取所有配送方式
    async listDelivery(req, res, next){
        let responseData;
        try{
            const deliveries = await DeliveryModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                deliveries
            }
        }catch(err ){
            responseData = {
                error_code: 4004,
                error_type: 'GET_DELIVERY_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Delivery();
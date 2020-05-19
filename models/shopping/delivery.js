'use strict';

import  mongoose from 'mongoose';
import deliveryData from '../../InitData/delivery'

const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    color: String,
    id: Number,
    is_solid: Boolean,
    text: String
})

DeliverySchema.index({id: 1});

const DeliveryModel = mongoose.model('Delivery', DeliverySchema);

DeliveryModel.findOne((err, data) => {
    if(!data){
        DeliveryModel.create(deliveryData);
    }
})

export default DeliveryModel;
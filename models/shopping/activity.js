'use strict';

import mongoose from 'mongoose';
import activityData from '../../InitData/activity';

const Schema = mongoose.Schema;

const activitySchema = new Schema({
    description: String,
    icon_color: String,
    icon_name: String,
    id: Number,
    name: String,
    ranking_weight: Number  
})

activitySchema.index({index: 1});

const ActivityModel = mongoose.model('Activity', activitySchema);

ActivityModel.findOne((err, data) => {
    if(!data){
        activityData.forEach(item => {
            ActivityModel.create(item);
        })
    }
})

export default ActivityModel
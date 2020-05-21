'use strict';

import mongoose from 'mongoose';

const idsSchema = new mongoose.Schema({
    admin_id: Number,
    img_id: Number,
    carts_id: Number,
    restaurant_id: Number,
    menu_id: Number,
    item_id: Number
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
    if(!data){
        const newIds = new Ids({
            admin_id: 0,
            img_id: 0,
            carts_id: 0,
            restaurant_id: 0,
            menu_id: 0,
            item_id: 0
        });
        newIds.save();
    }
})

export default Ids
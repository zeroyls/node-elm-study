'use strict';

import mongoose from 'mongoose';
import categoryData from '../../InitData/category'

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    count: Number,
    id: Number,
    ids: [],
    image_url: String,
    level: Number,
    name: String,
    sub_categories: [{
        count: Number,
        id: Number,
        image_url: String,
        level: Number,
        name: String
    }]
})

categorySchema.statics.addCategory = async function(type){
    const categoryName = type.split('/');
    try{
        const allcate = await this.findOne();
        const subcate = await this.findOne({name: categoryName[0]});
        allcate.count ++;
        subcate.count ++;
        subcate.sub_categories.map(item => {
            if(item.name == categoryName[1]){
                return item.count ++
            }
        })
        await allcate.save();
        await subcate.save();
        console.log('保存category成功')
    }catch(err){
        throw new Error(err)
    }
}

const CategoryModel = mongoose.model('Category', categorySchema);

CategoryModel.findOne((err, data) => {
    if(!data){
        categoryData.forEach(item => {
            CategoryModel.create(item);
        })
    }
})

export default CategoryModel
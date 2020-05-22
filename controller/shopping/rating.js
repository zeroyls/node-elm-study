'use strict'

import RatingModel from '../../models/shopping/rating'
const debug = require('debug')('node-elm:ratingController')

class Rating {
    constructor(){
        this.type = ['ratings', 'scores', 'tags'];
        this.getRatings = this.getRatings.bind(this);
        this.getScores = this.getScores.bind(this);
        this.getTags = this.getTags.bind(this);

    }

    async initData(restaurant_id){
        try{
            const status = await RatingModel.initData(restaurant_id);
            return status;
        }catch(err ){
            debug('Error in initData: \n %o', err);
            throw new Error(err);
        }
    }

    async getRatings(req, res, next){
        let responseData;
        const {restaurant_id} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getRatings api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const ratings = await RatingModel.getData(restaurant_id, this.type[0]);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                ratings
            }
        }catch(err ){
            debug("Error in getRatings api:\n %o", err);
            responseData = {
                error_code: 4016,
                error_type: 'GET_RATINGS_ERROR',
            }
        }
        res.data = responseData;
        next();
    }

    async getScores(req, res, next){
        let responseData;
        const {restaurant_id} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getScores api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const scores = await RatingModel.getData(restaurant_id, this.type[1]);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                scores
            }
        }catch(err ){
            debug("Error in getScores api:\n %o", err);
            responseData = {
                error_code: 4017,
                error_type: 'GET_SCPRES_ERROR',
            }
        }
        res.data = responseData;
        next();
    }

    async getTags(req, res, next){
        let responseData;
        const {restaurant_id} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getTags api:\n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const tags = await RatingModel.getData(restaurant_id, this.type[2]);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                tags
            }
        }catch(err ){
            responseData = {
                error_code: 4018,
                error_type: 'GET_TAGS_ERROR',
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Rating()
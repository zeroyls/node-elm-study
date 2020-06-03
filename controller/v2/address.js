'use strict';

import BaseComponent from '../../prototype/baseComponent';
import AddressModel from '../../models/v2/address';
const debug = require('debug')('node-elm:addressController')

class Address extends BaseComponent{
    constructor(){
        super();
        this.addAddress = this.addAddress.bind(this);
    }

    async addAddress(req, res, next){
        let responseData;
        const {user_id} = req.params;
        const {address, address_detail, geohash, name, phone, phone_bk, poi_type = 0, sex, tag, tag_type} = req.body;

        try{
            if(!user_id){
                throw new Error('用户ID错误')
            }else if(!address){
                throw new Error('地址信息错误');
            }else if(!address_detail){
                throw new Error('详细地址信息错误');
            }else if(!geohash){
                throw new Error('geohash错误');
            }else if(!name){
                throw new Error('收货人姓名错误');
            }else if(!phone){
                throw new Error('收货手机号错误');
            }else if(!sex){
                throw new Error('性别错误')
            }else if(!tag){
                throw new Error('标签错误');
            }else if(!tag_type){
                throw new Error('标签类型错误')
            }
        }catch(err ){
            debug('Error in addAddress: \n %o', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        try{
            const address_id = await this.getId('address_id');
            const newAddress = {
                id: address_id,
                address,
                phone,
                phone_bk: phone_bk && phone_bk,
                name,
                st_geohash: geohash,
                address_detail,
                sex,
                tag,
                tag_type,
                user_id
            }
            await AddressModel.create(newAddress);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                newAddress
            }
        }catch(err ){
            debug('Error in addAddress: \n %o', err);
            responseData = {
                error_code: 4030,
                error_type: 'ADD_ADDRESS_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async deleteAddress(req, res, next){
        let responseData;
        const {address_id} = req.query;
        try{
            if(!address_id){
                throw new Error('地址ID错误');
            }
        }catch(err ){
            debug('Error in deleteAddress: \n %o', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }
        try{
            await AddressModel.findOneAndRemove({id: address_id});
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                address_id
            }
        }catch(err ){
            debug('Error in deleteAddress: \n %o', err);
            responseData = {
                error_code: 4031,
                error_type: 'DELETE_ADDRESS_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async listAddress(req, res, next){
        let responseData;
        const {user_id} = req.params;
        try{
            if(!user_id){
                throw new Error('用户ID错误');
            }
        }catch(err ){
            debug('Error in listAddress: \n %o', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }
        try{
            const addresses = await AddressModel.find({user_id}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                addresses
            }
        }catch(err ){
            debug('Error in listAddress: \n %o', err);
            responseData = {
                error_code: 4032,
                error_type: 'LIST_ADDRESS_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Address();
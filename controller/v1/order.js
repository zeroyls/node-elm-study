'use strict';

import BaseComponent from '../../prototype/baseComponent';
import OrderModel from '../../models/v1/order';
import CartModel from '../../models/v1/cart'
import dtime from 'time-formater';
import AddressModel from '../../models/v2/address';
const debug = require('debug')('node-elm:orderController');

class Order extends BaseComponent{
    constructor(){
        super()
        this.postOrder = this.postOrder.bind(this);
    }

    async postOrder(req, res, next){
        let responseData;
        const {user_id} = req.params;
        const {cart_id, address_id, entities} = req.body;
        try{
            if(!user_id){
                throw new Error('用户ID错误');
            }else if(!cart_id){
                throw new Error('购物车ID错误');
            }else if(!(entities instanceof Array) || !entities.length){
                throw new Error('entities参数错误');
            }else if(!address_id){
                throw new Error('收货地址ID错误');
            }
        }catch(err ){
            debug('Error in postOrder api: %o \n ', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        let cartDetail;
        let order_id;
        try{
            cartDetail = await CartModel.findOne({id: cart_id});
            order_id = await this.getId('order_id');
        }catch(err ){
            debug('Error in postOrder api: %o \n ', err);
            responseData = {
                error_code: 4034,
                error_type: "POST_ORDER_ERROR"
            }
            res.data = responseData;
            next();
            return
        }

        const deliver_fee = {
            price: cartDetail.cart.deliver_amount
        }
        const orderObj = {
            basket: {
                group: entities,
                packing_fee: {
                    name: cartDetail.cart.extra[0].name,
                    price: cartDetail.cart.extra[0].price,
                    quantity: cartDetail.cart.extra[0].quantity
                },
                deliver_fee
            },
            restaurant_id: cartDetail.cart.restaurant_id,
            restaurant_image_url: cartDetail.cart.restaurant_info.image_path,
            restaurant_name: cartDetail.cart.restaurant_info.name,
            formatted_created_at: dtime().format('YYYY-MM-DD HH:mm'),
            order_time: new Date().getTime(),
            time_pass: 900,
            status_bar: {
                color: 'f60',
                image_type: '',
                sub_title: '15分钟内支付',
                title: '',
            },
            total_amount: cartDetail.cart.total,
            total_quantity: entities[0].length,
            unique_id: order_id,
            id: order_id,
            user_id,
            address_id
        }

        try{
            await OrderModel.create(orderObj);
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                order: orderObj
            }
        }catch(err ){
            debug('Error in postOrder api: %o \n ', err);
            responseData = {
                error_code: 4034,
                error_type: "POST_ORDER_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    async listOrder(req, res, next){
        let responseData;
        const {user_id, limit = 20, offset = 0} = req.query;
        try{
            if(!user_id){
                throw new Error('用户ID错误');
            }   
        }catch(err ){
            debug('Error in listOrder api: %o \n ', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        try{
            const orders = await OrderModel.find({user_id}).sort({id: -1}).limit(limit).skip(offset);
            const timeNow = new Date().getTime();
            orders.map(item => {
                if(timeNow - item.order_time < 900000){
                    item.status_bar.title = '等待支付'
                }else{
                    item.status_bar.title = '支付超时'
                }
                item.time_pass = Math.ceil((timeNow - item.order_time)/1000);
                item.save();
                return item;
            })
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                orders
            }
        }catch(err ){
            debug('Error in listOrder api: %o \n ', err);
            responseData = {
                error_code: 4035,
                error_type: 'LIST_ORDER_ERROR'
            }

        }
        res.data = responseData;
        next();
    }

    async getOrderDetail(req, res, next){
        let responseData;
        const {user_id} = req.params;
        const {order_id} = req.query;
        try{
            if(!user_id){
                throw new Error('用户ID错误');
            }else if(!order_id){
                throw new Error('订单ID错误');
            }
        }catch(err ){
            debug("Error in getOrderDetail api: \n %o", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        try{
            const order = await OrderModel.findOne({id: order_id}, '-_id');
            const addressDetail = await AddressModel.findOne({id: order.address_id});
            const orderDetail = {...order, ...{addressDetail: addressDetail.address, consignee: addressDetail.name, deliver_time: '尽快送达', pay_method: '在线支付', phone: addressDetail.phone}};
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                orderDetail
            }
        }catch(err ){
            debug('Error in getOrderDetail api: \n  %o ', err);
            responseData = {
                error_code: 4036,
                error_type: "GET_ORDER_DETAIL_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    async listAllOrders(req, res, next){
        let responseData;
        const {restaurant_id, limit=20, offset = 0} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in listAllOrders: o% \n", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }
        try{
            const orders = await OrderModel.find({restaurant_id},'-_id').sort({id: -1}).limit(limit).skip(offset);
            const timeNow = new Date().getTime();
            orders.map(item => {
                if(timeNow - item.order_time < 900000){
                    item.status_bar.title = '等待支付'
                }else{
                    item.status_bar.title = '支付超时'
                }
                item.time_pass = Math.ceil((timeNow - item.order_time)/1000);
                item.save();
                return item;
            })
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                orders
            }
        }catch(err ){
            debug('Error in listAllOrders api: \n  %o ', err);
            responseData = {
                error_code: 4037,
                error_type: "LIST_ALL_ORDER_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    async getOrdersCount(req, res, next){
        let responseData;
        const {restaurant_id} = req.query;
        try{
            if(!restaurant_id){
                throw new Error('餐馆ID错误');
            }
        }catch(err ){
            debug("Error in getOrdersCount: o% \n", err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }
        try{
            const count = await OrderModel.find({restaurant_id}).count();

            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                count
            }
        }catch(err ){
            debug('Error in getOrdersCount api: \n  %o ', err);
            responseData = {
                error_code: 4038,
                error_type: "GET_ORDER_COUNT_ERROR"
            }
        }
        res.data = responseData;
        next();
    }
}

export default new Order();
'use strict';

import AddressComponent from '../../prototype/addressComponent'
import PaymentsModel from '../../models/v1/payments';
import ShopModel from '../../models/shopping/shop';
import CartModel from '../../models/v1/cart' 

const debug = require('debug')('node-elm:cartController');

class CartsController extends AddressComponent{
    constructor(){
        super();
        this.extra = [
            {
                description: '',
                name: '餐盒',
                price: 0,
                quantity: 1,
                type: 0
            }
        ]
        this.checkout = this.checkout.bind(this);
    }

    async checkout(req, res, next){
        let responseData;
        const user_id = req.session.user_id;
        const {come_from, geohash, entities =[], restaurant_id} = req.body;
        try{
            if(!(entities instanceof Array) || !entities.length){
                throw new Error('entities参数错误')
            }else if(!restaurant_id){
                throw new Error('restaurant_id参数错误')
            }
        }catch(err){
            debug('Error in checkout api: %o \n ', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        let payments;
        let cart_id;
        let restaurant;
        let deliver_time;
        let delivery_reach_time;
        let from = geohash.split(',')[0] + ',' + geohash.split(',')[1];
        try{
            payments = await PaymentsModel.find({}, '_id');
            cart_id = await this.getId('carts_id');
            restaurant = await ShopModel.findOne({id: restaurant_id});
            const to = restaurant.latitude + ',' + restaurant.longitude;
            deliver_time = await this.getDistance(from, to, 'tiemvalue');
            let time = new Date().getTime() + deliver_time * 1000;
            let hour = ('0' + new Date(time).getHours()).substr(-2);
            let minute = ('0' + new Date(time).getMinutes()).substr(-2);
            delivery_reach_time = hour + ':' + minute;
        }catch(err){
            debug('Error in checkout api: %o \n ', err);
            responseData = {
                error_code: 4033,
                error_type: 'CHECKOUT_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        const deliver_amount = 4;
        let price = 0; //食品价格
        entities.map(item => {
            price += item.price * item.quantity;
            if (item.packing_fee) {
                this.extra[0].price += item.packing_fee*item.quantity;
            }
            if (item.specs[0]) {
                return item.name = item.name + '-' + item.specs[0];
            }
        })
        //食品总价格
        const total = price + this.extra[0].price * this.extra[0].quantity + deliver_amount;
        //是否支持发票
        let invoice = {
            is_available: false,
            status_text: "商家不支持开发票",
        };
        restaurant.supports.forEach(item => {
            if (item.icon_name == '票') {
                invoice = {
                    is_available: true,
                    status_text: "不需要开发票",
                };
            }
        })
        const checkoutInfo = {
            id: cart_id,
            cart: {
                id: cart_id,
                groups: entities,
                extra: this.extra,
                deliver_amount,
                is_deliver_by_fengniao: !!restaurant.delivery_mode,
                original_total: total,
                phone: restaurant.phone,
                restaurant_id,
                restaurant_info: restaurant,
                restaurant_minimum_order_amount: restaurant.float_minimum_order_amount,
                total,
                user_id,
            },
            delivery_reach_time,
            invoice,
            sig: Math.ceil(Math.random()*1000000).toString(),
            payments,
        }
        try{
            const newCart = new CartModel(checkoutInfo);
            const cart = await newCart.save();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                cart
            }
        }catch(err){
            debug('Error in checkout api: %o \n ', err);
            responseData = {
                error_code: 4033,
                error_type: 'CHECKOUT_ERROR'
            }
        }
        res.data = responseData;
        next();
    }
}

export default new CartsController();
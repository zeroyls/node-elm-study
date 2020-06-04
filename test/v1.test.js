
import config from '../config/config';
import ERROR from '../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('v1 carts controller', function(){
    it('checkout api', async function(){
        const param = {
            restaurant_id: 1,
            geohash: "latitude: 31.22967,longitude: 121.4762",
            entities: [
                {
                    attrs: [],
                    extra: {},
                    id: 1,
                    name: "测试",
                    price: 3,
                    quantity: 10,
                    packing_fee: 1,
                    specs: []
                }
            ]
        }
        const resp = await agent.post(prefixUrl + '/v1/carts/checkout', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

describe('v1 order controller', function(){
    it('postOrder api', async function(){
        const param = {
            cart_id: 1,
            address_id: 2, 
            entities: [
                {
                    attrs: [],
                    extra: {},
                    id: 1,
                    name: "测试",
                    price: 3,
                    quantity: 10,
                    packing_fee: 1,
                    specs: []
                }
            ]
        }
        const resp = await agent.post(prefixUrl + '/v1/users/1/order/post', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listOrder api', async function(){
        const param = {
            user_id: 1
        }
        const resp = await agent.get(prefixUrl + '/v1/users/1/order/list', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getOrderDetail api', async function(){
        const param = {
            order_id: 5
        }
        const resp = await agent.get(prefixUrl + '/v1/users/1/order/get', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listAllOrders api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/v1/order/list', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getOrdersCount api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/v1/order/count', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})
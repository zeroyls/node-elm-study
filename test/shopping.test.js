
import config from '../config/config';
import ERROR from '../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('shopping shop controller', function(){
    it('addShop api', async function(){
        const param = {
            name: '添加测试商铺' + parseInt(10000 * Math.random()) ,
            address: '武汉市路xx号',
            latitude: '31.22967',
            longitude: '121.4762',
            phone: 123456789,
            image_path: 'aaa',
            category: '快餐便当',
        }

        const resp = await agent.post(prefixUrl + '/shopping/addshop', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
    
    it('getRestaurants api', async function(){
        const param = {
            latitude: 31.22967,
            longitude: 121.4762
        }
        const resp = await agent.get(prefixUrl + '/shopping/restaurants?latitude=31.22967&longitude=121.4762');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('addMenu api', async function(){
        const param = {
            name: '商铺内的食品种类' + parseInt(10000 * Math.random()) ,
            restaurant_id: 1
        }

        const resp = await agent.post(prefixUrl + '/shopping/addmenu', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('addFood api', async function(){
        const param = {
            name: '食品' + parseInt(10000 * Math.random()) ,
            image_path: "aaaa",
            restaurant_id: 1,
            menu_id: 1,
        }

        const resp = await agent.post(prefixUrl + '/shopping/addfood', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getFoods api', async function(){
        const param = {
            restaurant_id: 1
        }

        const resp = await agent.get(prefixUrl + '/shopping/v2/foods', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getCategories api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/v2/restaurant/category');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getActivity api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/v1/restaurants/activity_attributes');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getDelivery api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/v1/restaurants/delivery_modes');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

})

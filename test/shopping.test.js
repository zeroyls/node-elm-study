
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

        const resp = await agent.post(prefixUrl + '/shopping/shop/add', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('updateShop api', async function(){
        const param = {
            restaurant_id: 1,
            name: '更新测试商铺' + parseInt(10000 * Math.random()) ,
            address: 'xxx路',
            latitude: '32.22967',
            longitude: '122.4762',
            phone: 987654321,
            image_path: 'bbb',
            category: '快餐便当',
        }

        const resp = await agent.post(prefixUrl + '/shopping/shop/update', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
    
    it('listShop api', async function(){
        const param = {
            latitude: 31.22967,
            longitude: 121.4762
        }
        const resp = await agent.get(prefixUrl + '/shopping/shop/list', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })


    it('getShopDetail api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/shopping/shop/get', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getShopCount api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/shop/getCount');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('deleteShop api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/shopping/shop/delete', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

})

describe('shopping category controller', function(){
    it('listCategory api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/category/list');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

describe('shopping delivery controller', function(){
    it('listDelivery api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/delivery/list');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

describe('shopping activity controller', function(){
    it('listActivity api', async function(){
        const resp = await agent.get(prefixUrl + '/shopping/activity/list');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

describe('shopping rating controller', function(){
    it('getRatings api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/shopping/ratings/getatings', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getScores api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/shopping/ratings/getscores', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getTags api', async function(){
        const param = {
            restaurant_id: 1
        }
        const resp = await agent.get(prefixUrl + '/shopping/ratings/gettags', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})


describe('shopping food controller', function(){
    it('addFood api', async function(){
        const param = {
            name: '食品' + parseInt(10000 * Math.random()) ,
            image_path: "aaaa",
            restaurant_id: 1,
            menu_id: 1,
        }

        const resp = await agent.post(prefixUrl + '/shopping/food/add', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('updateFood api', async function(){
        const param = {
            name: '食品修改' + parseInt(10000 * Math.random()) ,
            image_path: "bbbaaaa",
            item_id: 3,
        }

        const resp = await agent.post(prefixUrl + '/shopping/food/update', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('deleteFood api', async function(){
        const param = {
            food_id: 3,
        }
        const resp = await agent.post(prefixUrl + '/shopping/food/delete', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listFoods api', async function(){
        const param = {
            restaurant_id: 1
        }

        const resp = await agent.get(prefixUrl + '/shopping/food/list', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getFoodsCount api', async function(){
        const param = {
            restaurant_id: 1
        }

        const resp = await agent.get(prefixUrl + '/shopping/food/getcount', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('addMenu api', async function(){
        const param = {
            name: '商铺内的食品种类' + parseInt(10000 * Math.random()) ,
            restaurant_id: 1
        }

        const resp = await agent.post(prefixUrl + '/shopping/menu/add', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listMenu api', async function(){
        const param = {
            restaurant_id: 1
        }

        const resp = await agent.get(prefixUrl + '/shopping/menu/list', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getMenuDetail api', async function(){
        const param = {
            menu_id: 1
        }

        const resp = await agent.get(prefixUrl + '/shopping/menu/get', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

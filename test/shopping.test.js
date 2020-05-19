
import config from '../config/config';
import ERROR from '../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('shopping shop controller', function(){
    it('getRestaurants api', async function(){
        const param = {
            latitude: 31.22967,
            longitude: 121.4762
        }
        const resp = await agent.get(prefixUrl + '/shopping/restaurants?latitude=31.22967&longitude=121.4762');
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

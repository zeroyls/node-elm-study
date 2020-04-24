
import config from '../../config/config';
import ERROR from '../../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('v1 cities controller', function(){
    const params = {
        type: 'hot'
    };

    it('getCity api', async function(){
        const resp = await agent.get(prefixUrl + '/v1/cities', params);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getCityById api', async function(){
        const resp = await agent.get(prefixUrl + '/v1/cities/1');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getExactAddress api', async function(){
        const resp = await agent.get(prefixUrl + '/v1/exactedaddress');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('search api', async function(){
        const params = {
            keyword: 'wuhan',
            // city_id: 1
        };
        const resp = await agent.get(prefixUrl + '/v1/search', params);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})
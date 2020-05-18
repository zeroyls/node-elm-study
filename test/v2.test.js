
import config from '../config/config';
import ERROR from '../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('v2 cities controller', function(){
    it('pois api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/pois/31.22967,121.4762');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

})

describe('v2 entry controller', function(){
    it('getEntry api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/index_entry');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

})
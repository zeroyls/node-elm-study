
import config from '../../config/config';
import ERROR from '../../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('admin controller', function(){
    it('register api', async function(){
        const params = {
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.equal(resp.body.error_code, ERROR.REQUEST_DATA_ERROR);
    })

    it('register api', async function(){
        const params = {
            user_name: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.equal(resp.body.error_code, ERROR.REQUEST_DATA_ERROR);
    })

    it('register api', async function(){
        const params = {
            user_name: 'admin',
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.equal(resp.body.error_code, ERROR.USER_HAS_EXIST);
    })


    it('register api', async function(){
        const params = {
            user_name: 'admin' + 10000 * Math.random(),
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('login api', async function(){
        const params = {
            user_name: 'admin',
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/login', params);
        should.notEqual(resp.body.error_code, -1);
    })
})

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
})
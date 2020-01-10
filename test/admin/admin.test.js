
import config from '../../config/config';
const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

describe('admin controller', function(){
    it('register api', async function(){
        const params = {
            user_name: 'admin',
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.notEqual(resp.body.error_code, -1);
    })
})
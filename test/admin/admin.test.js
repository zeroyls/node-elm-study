
const agent = require('superagent');
const should = require('should');
const config = require('config-lite')({
    filename: 'default',
    config_basedir: __dirname,
    config_dir: 'config'
});

const prefixUrl = 'http://localhost' + config.port;


describe('admin controller', function(){
    it('register api', async function(){
        const params = {
            user_name: 'admin',
            password: 'admin'
        };

        const resp = await agent.post(prefixUrl + '/admin/register', params);
        should.notEqual(resp.status, 0);
    })
})
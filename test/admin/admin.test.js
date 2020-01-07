
const agent = require('superagent');
const should = require('should');


describe('admin controller', function(){
    it('register api', async function(){
        const params = {
            user_name: 'admin',
            password: 'admin'
        };

        const resp = await agent.post('http://localhost:3000/admin/register', params);
        should.notEqual(resp.status, 0);
    })
})
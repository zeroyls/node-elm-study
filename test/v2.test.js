
import config from '../config/config';
import ERROR from '../error';

const agent = require('superagent');
const should = require('should');

const prefixUrl = 'http://localhost:' + config.port;

// describe('v2 cities controller', function(){
//     it('pois api', async function(){
//         const resp = await agent.get(prefixUrl + '/v2/pois/31.22967,121.4762');
//         should.equal(resp.body.error_code, ERROR.ERROR_OK);
//     })

// })

// describe('v2 entry controller', function(){
//     it('getEntry api', async function(){
//         const resp = await agent.get(prefixUrl + '/v2/index_entry');
//         should.equal(resp.body.error_code, ERROR.ERROR_OK);
//     })

// })

describe('v2 user controller', function(){
    
    it('login api', async function(){
        let cap = '';
        const resp = await agent.get(prefixUrl + '/v2/captcha');
        // should.equal(resp.body.error_code, ERROR.ERROR_OK);
        if (resp.headers && resp.headers['set-cookie']) {
            for (let v of resp.headers['set-cookie']) {
                cap = v.match(/cap=[^;]*/);
                if (cap) {
                    console.log(cap)
                    break;
                }
            }
        }

        console.log("captcha_code:", cap[0].split("=")[1])
        const param = {
            username: "myuser",
            password: "bbb",
            captcha_code: cap[0].split("=")[1]
        }
        const loginresp = await agent.post(prefixUrl + '/v2/user/login', param).set('Cookie', cap);
        should.equal(loginresp.body.error_code, ERROR.ERROR_OK);
    })

    it('changePassword api', async function(){
        let cap = '';
        const resp = await agent.get(prefixUrl + '/v2/captcha');
        // should.equal(resp.body.error_code, ERROR.ERROR_OK);
        if (resp.headers && resp.headers['set-cookie']) {
            for (let v of resp.headers['set-cookie']) {
                cap = v.match(/cap=[^;]*/);
                if (cap) {
                    // console.log(cap)
                    break;
                }
            }
        }

        console.log("captcha_code:", cap[0].split("=")[1])
        const param = {
            username: "myuser",
            oldpassword: "bbb",
            newpassword: "ccc",
            confirmpassword: "ccc",
            captcha_code: cap[0].split("=")[1]
    
        }
        const resp1 = await agent.post(prefixUrl + '/v2/user/changepassword', param).set('Cookie', cap);
        should.equal(resp1.body.error_code, ERROR.ERROR_OK);
    })

    it('signout api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/user/signout');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listUser api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/user/list');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getUserInfo api', async function(){
        const param = {user_id: 1};
        const resp = await agent.get(prefixUrl + '/v2/user/get', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('getUserCount api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/user/getcount');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })
})

describe('v2 address controller', function(){
    it('addAddress api', async function(){
        const param = {
            address: "武汉市xxxx", 
            address_detail: "详细地址", 
            geohash:"latitude: 31.22967,longitude: 121.4762", 
            name: "哈哈", 
            phone: "123456789", 
            phone_bk: "987654321", 
            sex: 2, 
            tag: "公司", 
            tag_type: 1
        }
        const resp = await agent.post(prefixUrl + '/v2/user/1/address/add', param);
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    it('listAddress api', async function(){
        const resp = await agent.get(prefixUrl + '/v2/user/1/address/list');
        should.equal(resp.body.error_code, ERROR.ERROR_OK);
    })

    // it('deleteAddress api', async function(){
    //     const param = {
    //         address_id: 1
    //     }
    //     const resp = await agent.get(prefixUrl + '/v2/user/address/delete', param);
    //     should.equal(resp.body.error_code, ERROR.ERROR_OK);
    // })

})
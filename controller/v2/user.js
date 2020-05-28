'use strict';

import UserInfoModel from '../../models/v2/userinfo';
import UserModel from '../../models/v2/user';
import crypto from 'crypto'
import dtime from 'time-formater'
import AddressComponent from '../../prototype/addressComponent' 



const debug = require('debug')('node-elm:userController');

class User extends AddressComponent{
    constructor(){
        super();
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    async login(req, res, next){
        let responseData;
        const cap = req.cookies.cap;
        if(!cap){
            responseData = {
                error_code: 4024,
                error_type: 'OUTIME_CAPTCHA',
            }
            res.data = responseData;
            next();
            return;
        }

        const {username, password, captcha_code} = req.body;
        try{
            if(!username){
                throw new Error('用户名参数错误');
            }else if(!password){
                throw new Error('密码参数错误');
            }else if(!captcha_code){
                throw new Error('验证码参数错误')
            }
        }catch(err ){
            debug('Error in user login: \n %o', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        if(cap.toString() !== captcha_code.toString()){
            responseData = {
                error_code: 4023,
                error_type: 'ERROR_CAPTCHA'
            }
            res.data = responseData;
            next();
            return
        }

        const newpassword = this.encryption(password);
        try{
            const user = await UserModel.findOne({username});
            if(!user){//不存在则创建一个用户
                const user_id = await this.getId('user_id');
                const cityInfo = await this.guessPosition(req);
                const registe_time = dtime().format('YYYY-MM-DD HH:mm');
                const newUser = {username, password: newpassword, user_id};
                const newUserInfo = {username, user_id, id: user_id, city: cityInfo.city, registe_time};
                UserModel.create(newUser);
                const createUser = new UserInfoModel(newUserInfo);
                const userinfo = await createUser.save();
                req.session.user_id = user_id;
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK',
                    userinfo
                }
            }else if(newpassword.toString() != user.password.toString()){
                responseData = {
                    error_code: 2002,
                    error_type: 'PASSWORD_ERROR',
                }
            }else{
                req.session.user_id = user.user_id;
                const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK',
                    userinfo
                }
            }
        }catch(err ){
            debug('Error in user login: \n %o', err);
            responseData = {
                error_code: 4025,
                error_type: 'LOGIN_FAIL'
            }
        }
        res.data = responseData;
        next();
    }

    async signout(req, res, next){
        delete req.session.user_id;
        res.data = {
            error_code: 0,
            error_type: 'ERROR_OK'
        }
        next();
    }

    async changePassword(req, res, next){
        let responseData;
        const cap = req.cookies.cap;
        if(!cap){
            responseData = {
                error_code: 4024,
                error_type: 'OUTIME_CAPTCHA',
            }
            res.data = responseData;
            next();
            return;
        }
        const { username, oldpassword, newpassword, confirmpassword, captcha_code} = req.body;
        try{
            if(!username){
                throw new Error('用户名参数错误');
            }else if(!oldpassword){
                throw new Error('旧密码参数错误');
            }else if(!newpassword){
                throw new Error('新密码参数错误');
            }else if(!confirmpassword){
                throw new Error('确认密码参数错误');
            }else if(newpassword != confirmpassword){
                throw new Error('两次密码不一致');
            }else if(!captcha_code){
                throw new Error('验证码参数错误')
            }
        }catch(err ){
            debug('Error in user changePassword: \n %o', err);
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return
        }

        if(cap.toString() !== captcha_code.toString()){
            responseData = {
                error_code: 4023,
                error_type: 'ERROR_CAPTCHA'
            }
            res.data = responseData;
            next();
            return
        }

        const password = this.encryption(oldpassword);
        try{
            const user = await UserModel.findOne({username});
            if(!user){
                responseData = {
                    error_code: 2001,
                    error_type: 'USER_NOT_EXIST'
                }
            }else if(user.password.toString() != password.toString()){
                responseData = {
                    error_code: 2002,
                    error_type: 'PASSWORD_ERROR'
                }
            }else{
                console.log("dfdff")
                user.password = this.encryption(newpassword);
                await user.save();
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK'
                }
            }
            
        }catch(err ){
            debug('Error in user changePassword: \n %o', err);
            responseData = {
                error_code: 4026,
                error_type: 'CHANGEPASSWORD_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async listUser(req, res, next){
        let responseData;
        const {limit = 20, offset = 0} = req.query;
        try{
            const users = await UserInfoModel.find({}, '-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                users
            }
        }catch(err ){
            debug('Error in listUser: \n %o', err);
            responseData = {
                error_code: 4027,
                error_type: "LIST_USER_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    async getUserInfo(req, res, next){
        let responseData;
        const {user_id} = req.query;
        try{
            if(!user_id){
                throw new Error('用户ID错误');
            }
        }catch(err ){
            debug("Error in getUserInfo: \n %o", err);
            responseData = {
                error_code: 1000,
                error_type: "REQUEST_DATA_ERROR"
            }
            res.data = responseData;
            next();
            return;
        }
        try{
            const user = await UserInfoModel.findOne({user_id}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                user
            }
        }catch(err ){
            debug("Error in getUserInfo: \n %o", err);
            responseData = {
                error_code: 4028,
                error_type: "GET_USERINFO_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    async getUserCount(req, res, next){
        let responseData;
        try{
            const count = await UserInfoModel.count();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                count
            }
        }catch(err ){
            debug("Error in getUserCount: \n %o", err);
            responseData = {
                error_code: 4029,
                error_type: "GET_USERCOUNT_ERROR"
            }
        }
        res.data = responseData;
        next();
    }

    encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}

}

export default new User()
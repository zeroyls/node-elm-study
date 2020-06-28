'use strict';
import AdminModel from '../../models/admin/admin';
import BaseComponent from '../../prototype/baseComponent'
import crypto from 'crypto';
import dtime from 'time-formater';

class AdminController extends BaseComponent{
    constructor(){
        super();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
    }

    async register(req, res, next){
        const {user_name, password, status = 1} = req.body;
        let responseData;
        try{
            if(!user_name){
                throw new Error('用户名错误');
            }else if(!password){
                throw new Error('密码错误');
            }
        }catch(err){
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;      
        }

        try{
            const admin = await AdminModel.findOne({user_name});
            if(admin){
                responseData = {
                    error_code: 2000,
                    error_type: 'USER_HAS_EXIST'
                }
            }else{
                const adminTip = status == 1 ? '管理员' : '超级管理员';
                const admin_id = await this.getId('admin_id');
                const newpassword = this.encryption(password);
                const newAdmin = {
                    user_name,
                    password: newpassword,
                    id: admin_id,
                    create_time: dtime().format('YYYY-MM-DD'),
                    admin: adminTip,
                    status
                }
                await AdminModel.create(newAdmin);
                req.session.admin_id = admin_id;
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK'
                }
            }
        }catch(err){
            responseData = {
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async login(req, res, next){
        const {user_name, password, status = 1} = req.body;
        let responseData;
        try{
            if(!user_name){
                throw new Error('用户名参数错误');
            }else if(!password){
                throw new Error('密码参数错误');
            }
        }catch(err){
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;  
        }

        const newpassword = this.encryption(password);
        try{
            const admin = await AdminModel.findOne({user_name});
            if(!admin){
                // responseData = {
                //     error_code: 2001,
                //     error_type: 'USER_NOT_EXIST'
                // }
                const adminTip = status == 1 ? '管理员' : '超级管理员';
                const admin_id = await this.getId('admin_id');
                const newpassword = this.encryption(password);
                const newAdmin = {
                    user_name,
                    password: newpassword,
                    id: admin_id,
                    create_time: dtime().format('YYYY-MM-DD'),
                    admin: adminTip,
                    status
                }
                await AdminModel.create(newAdmin);
                req.session.admin_id = admin_id;
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK'
                }
            }else if(newpassword.toString() != admin.password.toString()){
                responseData = {
                    error_code: 2002,
                    error_type: 'PASSWORD_ERROR'
                }
            }else{
                req.session.admin_id = admin.id;
                responseData = {
                    error_code: 0,
                    error_type: 'ERROR_OK'
                }
            }
        }catch(err){
            responseData = {
                error_code: 1001,
                error_type: 'DATABASE_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async signout(req, res, next){
        let responseData;
        try{
            delete req.session.admin_id;
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK'
            }
        }catch(err){
            responseData = {
                error_code: 2004,
                error_type: 'SIGOUT_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async getAllAdmin(req, res, next){
        const {limit = 20, offset = 0}  = req.query;
        let responseData;
        try{
            const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit));
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                allAdmin
            }
        }catch(err){
            responseData = {
                error_code: 2005,
                error_type: 'GET_ALL_ADMIN_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async getAdminCount(req, res, next){
        let responseData;
        try{
            const count = await AdminModel.count();
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                count
            }
        }catch(err){
            responseData = {
                error_code: 2006,
                error_type: 'GET_ADMIN_COUNT_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    async getAdminInfo(req, res, next){
        const admin_id = req.session.admin_id;
        let responseData;
        if(!admin_id || !Number(admin_id)){
            responseData = {
                error_code: 1003,
                error_type: 'NOT_LOGIN'
            }
            res.data = responseData;
            next();
            return
        }

        try{
            const info = await AdminModel.findOne({id: admin_id}, '-_id -__v -password');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                info
            }
        }catch(err){
            responseData = {
                error_code: 2007,
                error_type: 'GET_ADMIN_INFO_ERROR'
            }
        }
        res.data = responseData;
        next();
    }

    // 上传头像
    async updateAvatar(req, res, next){
        const admin_id = req.params.admin_id;
        let responseData;
        if(!admin_id || !Number(admin_id)){
            responseData = {
                error_code: 1000,
                error_type: 'REQUEST_DATA_ERROR'
            }
            res.data = responseData;
            next();
            return;
        }

        try{
            const image_path = await this.getPath(req);
            await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}});
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                image_path
            }
        }catch(err){
            if(err == 'PARSE_IMG_ERROR'){
                responseData = {
                    error_code: 3004,
                    error_type: 'PARSE_IMG_ERROR'
                }
            }else if(err == 'DATABASE_ID_ERROR'){
                responseData = {
                    error_code: 1002,
                    error_type: 'DATABASE_ID_ERROR'
                }
            }else if(err == 'IMG_FORMAT_ERROR'){
                responseData = {
                    error_code: 3002,
                    error_type: 'IMG_FORMAT_ERROR'
                }
            }else{
                responseData = {
                    error_code: 3001,
                    error_type: 'UPLOAD_IMG_ERROR'
                }
            }
        }

        res.data = responseData;
        next();
    }


    //helper function
    encryption(password){
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword;
    }

    Md5(password){
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}

export default new AdminController();
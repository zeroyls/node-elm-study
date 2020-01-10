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
                responseData = {
                    error_code: 2001,
                    error_type: 'USER_NOT_EXIST'
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

    async singout(req, res, next){
        try{
            delete req.session.admin_id;
            res.send({
                status: 1,
                message: '退出成功'
            })
        }catch(err){
            res.send({
                status: 0,
                message: '退出失败'
            })
        }
    }

    async getAllAdmin(req, res, next){
        const {limit = 20, offset = 0}  = req.query;
        try{
            const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit));
            res.send({
                status: 1,
                data: allAdmin
            })
        }catch(err){
            res.send({
                status: 0,
                message: '获取超级管理列表失败'
            })
        }
    }

    async getAdminCount(req, res, next){
        try{
            const count = await AdminModel.count();
            res.send({
                status: 1,
                count   
            })
        }catch(err){
            res.send({
                status: 0,
                message: '获取管理员数量失败'
            })
        }
    }

    async getAdminInfo(req, res, next){
        const admin_id = req.session.admin_id;
        if(!admin_id || !Number(admin_id)){
            res.send({
                status: 0,
                message: '获取管理员信息失败'
            })
            return
        }

        try{
            const info = await AdminModel.findOne({id: admin_id}, '-_id -__v -password');
            if(!info){
                throw new Error('未找到当前管理员')
            }else{
                res.send({
                    status: 1,
                    data: info
                })
            }
        }catch(err){
            res.send({
                status: 0,
                message: '获取管理员信息失败'
            })
        }
    }

    async updateAvatar(req, res, next){
        const admin_id = req.params.admin_id;
        console.log(admin_id)
        if(!admin_id || !Number(admin_id)){
            console.log("admin_id参数错误", admin_id);
            res.send({
                status: 0,
                message: 'admin_id参数错误'
            })
            return
        }

        try{
            const image_path = await this.getPath(req);
            await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}});
            res.send({
                status: 1,
                image_path
            })
            return
        }catch(err){
            console.log('上传图片失败', err);
            res.send({
                status: 0,
                message: '上传图片失败'
            })
        }
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
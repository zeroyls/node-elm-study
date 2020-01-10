'use strict';
import AdminModel from '../../models/admin/admin';
import BaseComponent from '../../prototype/baseComponent'
import crypto from 'crypto';
import formidable from 'formidable';
import dtime from 'time-formater';



class AdminController extends BaseComponent{
    constructor(){
        super();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
    }

    async register(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if(err){
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: '表单信息错误'
                })
                return
            }
            const {user_name, password, status = 1} = fields;
            try{
                if(!user_name){
                    throw new Error('用户名错误');
                }else if(!password){
                    throw new Error('密码错误');
                }
            }catch(err){
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message
                })
                return
            }
            try{
                const admin = await AdminModel.findOne({user_name});
                if(admin){
                    res.send({
                        status: 0,
                        type: 'USER_HAS_EXIST',
                        message: '该用户已经存在'
                    })
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
                    res.send({
                        status: 1,
                        message: '注册管理员成功'
                    })
                }
            }catch(err){
                console.log(err)
                res.send({
                    status: 0,
                    type: 'REGISTER_ADMIN_FAILED',
                    message: '注册管理员失败'
                })
            }
        })
    }

    async login(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if(err){
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: '表单信息错误'
                })
                return
            }
            const {user_name, password, status = 1} = fields;
            try{
                if(!user_name){
                    throw new Error('用户名参数错误');
                }else if(!password){
                    throw new Error('密码参数错误');
                }
            }catch(err){
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message
                })
                return
            }
            const newpassword = this.encryption(password);
            try{
                const admin = await AdminModel.findOne({user_name});
                if(!admin){
                    res.send({
                        status: 0,
                        message: '用户名不存在'
                    })
                }else if(newpassword.toString() != admin.password.toString()){
                    res.send({
                        status: 0,
                        message: '管理员登录密码错误'
                    })
                }else{
                    req.session.admin_id = admin.id;
                    res.send({
                        status: 1,
                        message: '登录成功'
                    })
                }
            }catch(err){
                res.send({
                    status: 0,
                    message: '管理员登录失败'
                })
            }
        })
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
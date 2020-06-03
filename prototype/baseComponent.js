'use strict';

import Ids from '../models/ids';
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import gm from 'gm'
import fetch from 'node-fetch'

export default class BaseComponent{
    constructor(){
        this.idList = ['admin_id', 'img_id', 'restaurant_id','menu_id', 'item_id', 'user_id', 'address_id'];
        this.uploadImg = this.uploadImg.bind(this);
    }

    //封装fetch函数
    async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
        type = type.toUpperCase();
        resType = resType.toUpperCase;
        if(type == 'GET'){
            let dataStr = '';
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            })

            if(dataStr !== ''){
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
        }

        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        if(type == "POST"){
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }

        let responseJson;
        try{
            const response = await fetch(url, requestConfig);
            if(resType === 'TEXT'){
                responseJson = await response.text();
            }else{
                responseJson = await response.json();
            }
        }catch(err){
            throw new Error(err)
        }
        return responseJson;
    }

    // Ids表存放的都是新的id
    // 获取新增的id
    async getId(type){
        if(!this.idList.includes(type)){
            throw new Error('id类型错误');
        }
        try{
            const idData = await Ids.findOne();
            idData[type] ++;
            await idData.save();
            return idData[type];
        }catch(err){
            throw new Error(err);
        }
    }

    //上传图像
    async uploadImg(req, res, next){
        const type = req.params.type;
        let responseData;
        try{
            const image_path = await this.getPath(req);
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
        return;
    }

    // 上传文件，并返回文件地址
    async getPath(req, res){
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img';//这个目录要先建好
            form.parse(req, async(err, fields, files) => {
                if(!files || !files.file){
                    reject('PARSE_IMG_ERROR', 3004);
                    return;
                }

                let img_id;
                try{
                    img_id = await this.getId('img_id');
                }catch(err){
                    fs.unlinkSync(files.file.path);
                    reject('DATABASE_ID_ERROR', 1002);
                    return;
                }

                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
                const extname = path.extname(files.file.name);
                if(!['.jpg', '.jpeg', '.png'].includes(extname)){
                    fs.unlinkSync(files.file.path);
                    reject('IMG_FORMAT_ERROR', 3002);
                    return;
                }

                const fullName = hashName + extname;
                const repath = './public/img/' + fullName;

                try{
                    fs.renameSync(files.file.path, repath);
                    gm(repath).resize(200, 200, "!").write(repath, async (err) => {
                        resolve(fullName)
                    })
                }catch(err){
                    if(fs.existsSync(repath)){
                        fs.unlinkSync(repath);
                    }else{
                        fs.unlinkSync(files.file.path)
                    }
                    reject('SAVE_IMG_ERROR', 3003)
                }
            })
        })
    }
}
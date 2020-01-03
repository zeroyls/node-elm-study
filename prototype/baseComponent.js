'use strict';

import Ids from '../models/ids';
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import gm from 'gm'
import fetch from 'node-fetch'

export default class BaseComponent{
    constructor(){
        this.idList = ['admin_id', 'img_id'];
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

    async getId(type){
        if(!this.idList.includes(type)){
            throw new Error('id类型错误');
            return
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

    async getPath(req, res){
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img';//这个目录要先建好
            form.parse(req, async(err, fields, files) => {
                let img_id;
                try{
                    img_id = await this.getId('img_id');
                }catch(err){
                    fs.unlinkSync(files.file.path);
                    reject('获取图片id失败');
                }

                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
                const extname = path.extname(files.file.name);
                if(!['.jpg', '.jpeg', '.png'].includes(extname)){
                    fs.unlinkSync(files.file.path);
                    res.send({
                        status: 0,
                        message: '文件格式错误' 
                    })
                    reject('上传失败');
                    return
                }
                const fullName = hashName + extname;
                const repath = './public/img/' + fullName;
                try{
                    fs.renameSync(files.file.path, repath);
                    gm(repath).resize(200, 200, "!").write(repath, async (err) => {
                        resolve(fullName)
                    })

                }catch(err){
                    console.log('保存图片失败', err);
                    if(fs.existsSync(repath)){
                        fs.unlinkSync(repath);
                    }else{
                        fs.unlinkSync(files.file.path)
                    }
                    reject('保存图片失败')
                }
            })
        })
    }
}
import {errorLogger} from '../logger';

export default function(req, res, next){
    try{
        res.send(res.data);
    }catch(err){//哪里第二error才能被截获
        errorLogger.error(`${req.originalUrl}\n`, err);
        res.send({
            error_code: -1,
            error_type: 'UNKNOW_ERROR'
        });
    }
}
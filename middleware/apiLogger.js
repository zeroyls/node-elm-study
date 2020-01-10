import {apiLogger} from '../logger';

export default function(req, res, next){
    apiLogger.info(`${req.originalUrl} request data: ${JSON.stringify(req.body)}`);
    apiLogger.info(`${req.originalUrl} response data: ${JSON.stringify(res.data)}`);
    next();
}
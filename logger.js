
import log4js from 'log4js';

log4js.configure({
    appenders: {
        serverInfoAppenders: {
            type: "file",
            filename: __dirname + "/logs/server.log",
            maxLogSize: 1024 * 1024, //(byte)
            backups: 10,
            compress: true
        },
        //打印：[2020-01-10T10:38:25.595] [INFO] expressLogger - ::1 - - "POST /admin/register HTTP/1.1" 200 65 "" "PostmanRuntime/7.21.0"
        expressAppenders: {
            type: "file",
            filename: __dirname + "/logs/express.log",
            maxLogSize: 1024 * 1024, //(byte)
            backups: 10,
            compress: true
        },
        apiAppenders: {
            type: "file",
            filename: __dirname + "/logs/api.log",
            maxLogSize: 1024 * 1024, //(byte)
            backups: 10,
            compress: true
        },
        errorAppenders: {
            type: "file",
            filename: __dirname + "/logs/error.log",
            maxLogSize: 1024 * 1024, //(byte)
            backups: 10,
            compress: true
        }
    },
    categories: {
        default: { appenders: ['serverInfoAppenders'], level: "info"},
        serverInfoLogger: {appenders: ['serverInfoAppenders'], level: "info"},
        expressLogger: { appenders: ['expressAppenders'], level: "info"},
        apiLogger: { appenders: ['apiAppenders'], level: "debug"},
        errorLogger: {appenders: ['errorAppenders'], level: "error"}
    }
})

export const serverInfoLogger = log4js.getLogger('serverInfoLogger');

export const connectExpressLogger = function(app){
    const expressLogger = log4js.getLogger('expressLogger');
    app.use(log4js.connectLogger(expressLogger, {
        level: 'auto',
        // format: (req, res, formatter) => formatter(`:remote-addr :method :url ${JSON.stringify(req.body)}`)
    }))
}

export const apiLogger = log4js.getLogger('apiLogger');

export const errorLogger = log4js.getLogger('errorLogger');
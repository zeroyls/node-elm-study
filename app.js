
import db from './mongodb/db';
import express from 'express';
import session from 'express-session'
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import bodyParser from 'body-parser';
import {serverInfoLogger, connectExpressLogger} from './logger';
import apiLoggerMiddleware from './middleware/apiLogger';
import responseMiddleware from './middleware/response';
import config from './config/config'

const app = express();

app.use(bodyParser.json()); // for parsing application/json 无效
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded, 有效

const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    name:config.session.name,//这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({//创建新的mongodb数据库
        url: config.url
    })
}))

connectExpressLogger(app); //打印express log, 在res.send代码前注册res finish 事件
router(app);//路由处理业务逻辑
app.use(apiLoggerMiddleware);//打印api 请求响应数据， 可以只在debug的时候打开
app.use(responseMiddleware);//发送数据

app.use(express.static('./public'))
app.listen(config.port, () => {
    console.log(`成功监听端口：${config.port}`);
    serverInfoLogger.info(`成功监听端口：${config.port}`);
})
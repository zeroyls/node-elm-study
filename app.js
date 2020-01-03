
import db from './mongodb/db';
import express from 'express';
import session from 'express-session'
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';

const config = require('config-lite')({
    filename: 'default',
    config_basedir: __dirname,
    config_dir: 'config'
});

const app = express();
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


app.all('*', (req, res, next) => {
    next();
})

router(app);

app.use(express.static('./public'))
app.listen(3000, () => {
    console.log(`成功监听端口：3000`)
})
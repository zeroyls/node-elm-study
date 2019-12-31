
import db from './mongodb/db';
import express from 'express';
import session from 'express-session'
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';

const url = 'mongodb://localhost:27017/sdada';
const app = express();
const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
    secret:'SID',
    name:'SID',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie:{
        maxAge: 8000,//设置maxAge是8000ms，即8s后session和相应的cookie失效过期
        httpOnly: true,
        secure: false
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({//创建新的mongodb数据库
        url: url
    })
}))


app.all('*', (req, res, next) => {
    console.log(req.session);
    next();
})

app.listen(3000, () => {
    console.log(`成功监听端口：3000`)
})
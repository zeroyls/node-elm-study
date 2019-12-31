
import mongoose from 'mongoose';
const config = require('config-lite')({
    filename: 'default',
    config_basedir: __dirname,
    config_dir: 'config'
});

mongoose.connect(config.url);

const db = mongoose.connection;

db.once('open', function(err){
    console.log('连接数据库成功');
});

db.on('error', function(error){
    console.log('Connect database error', error);
    mongoose.disconnect();
});

db.on('close', function(err){
    console.log('Database close');
    mongoose.connect(config.url);
});

export default db;
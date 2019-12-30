
import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/sdada';
mongoose.connect(url);

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
    mongoose.connect(url);
});

export default db;
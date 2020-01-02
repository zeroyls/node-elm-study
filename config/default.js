'use strict';

module.exports = {
    port: parseInt(process.env.PORT, 10) || 8001,
    url: 'mongodb://localhost:27017/elm',
    session: {
        name: 'SID',
        secret: 'SID',
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 80000//8s
        }
    }
}
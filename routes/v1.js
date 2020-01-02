'use strict';

import express from 'express';

const router = express.Router();

router.get('/cities', (req, res, next) =>{
    console.log("get v1 cities");
    res.send(
        "v1 cities"
    )
})

export default router;
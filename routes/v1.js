'use strict';

import express from 'express';
import CityController from '../controller/v1/cities';
import BaseController from '../prototype/baseComponent';
import CartsController from '../controller/v1/cart';

const baseController = new BaseController();

const router = express.Router();

router.get('/cities', CityController.getCity);
router.get('/cities/:id', CityController.getCityById);
router.get('/exactedaddress', CityController.getExactAddress);
router.get('/search', CityController.search);
router.post('/addimg/:type', baseController.uploadImg);

router.post('/carts/checkout', CartsController.checkout);


export default router;
'use strict';

import express from 'express';
import CityController from '../controller/v1/cities';
import BaseController from '../prototype/baseComponent';
import CartsController from '../controller/v1/cart';
import OrderController from '../controller/v1/order';


const baseController = new BaseController();

const router = express.Router();

router.get('/cities', CityController.getCity);
router.get('/cities/:id', CityController.getCityById);
router.get('/exactedaddress', CityController.getExactAddress);
router.get('/search', CityController.search);
router.post('/addimg/:type', baseController.uploadImg);

router.post('/carts/checkout', CartsController.checkout);

router.get('/users/:user_id/order/list', OrderController.listOrder);
router.get('/users/:user_id/order/get', OrderController.getOrderDetail);
router.post('/users/:user_id/order/post', OrderController.postOrder);
router.get('/order/list', OrderController.listAllOrders);
router.get('/order/count', OrderController.getOrdersCount);


export default router;
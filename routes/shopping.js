'use strict';

import express from 'express';
import Shop from '../controller/shopping/shop';
import Category from '../controller/shopping/category'
import FoodController from '../controller/shopping/food'
import DeliveryController from '../controller/shopping/delivery'
import ActivityController from '../controller/shopping/activity'

const router = express.Router();


router.post('/addshop', Shop.addShop);
router.get('/restaurants', Shop.getRestaurants);

// 店铺内的食品种类 start
router.post('/menu/add', FoodController.addMenu);
router.get('/menu/list', FoodController.listMenu);
router.get('/menu/get', FoodController.getMenuDetail);
// 店铺内的食品种类 end

// 店铺内的食品：增删改查 start
router.post('/food/add', FoodController.addFood);
router.post('/food/delete', FoodController.deleteFood);
router.post('/food/update', FoodController.updateFood);
router.get('/food/list', FoodController.listFoods);
router.get('/food/getcount', FoodController.getFoodsCount);
// 店铺内的食品：增删改查 end

router.get('/v2/restaurant/category', Category.getCategories);

router.get('/delivery/list', DeliveryController.listDelivery);

router.get('/activity/list', ActivityController.listActivity);

export default router;
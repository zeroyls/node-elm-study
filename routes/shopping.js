'use strict';

import express from 'express';
import Shop from '../controller/shopping/shop';
import Category from '../controller/shopping/category'
import FoodController from '../controller/shopping/food'

const router = express.Router();


router.post('/addshop', Shop.addShop);
router.get('/restaurants', Shop.getRestaurants);
router.post('/addmenu', FoodController.addMenu);

// 店铺内的食品：增删改查 start
router.post('/food/add', FoodController.addFood);
router.post('/food/delete', FoodController.deleteFood);
router.post('/food/update', FoodController.updateFood);
router.get('/food/list', FoodController.listFoods);
router.get('/food/getcount', FoodController.getFoodsCount);
// 店铺内的食品：增删改查 end

router.get('/v2/restaurant/category', Category.getCategories);
router.get('/v1/restaurants/delivery_modes', Category.getDelivery);
router.get('/v1/restaurants/activity_attributes', Category.getActivity);

export default router;
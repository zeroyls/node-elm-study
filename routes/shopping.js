'use strict';

import express from 'express';
import Shop from '../controller/shopping/shop';
import Category from '../controller/shopping/category'
import FoodController from '../controller/shopping/food'

const router = express.Router();


router.post('/addshop', Shop.addShop);
router.get('/restaurants', Shop.getRestaurants);
router.post('/addmenu', FoodController.addMenu);
router.post('/addfood', FoodController.addFood);
router.post('/deletefood/:food_id', FoodController.deleteFood);
router.get('/v2/foods', FoodController.getFoods);
router.get('/v2/restaurant/category', Category.getCategories);
router.get('/v1/restaurants/delivery_modes', Category.getDelivery);
router.get('/v1/restaurants/activity_attributes', Category.getActivity);

export default router;
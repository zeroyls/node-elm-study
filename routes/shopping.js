'use strict';

import express from 'express';
import Shop from '../controller/shopping/shop';
import Category from '../controller/shopping/category'

const router = express.Router();

router.get('/restaurants', Shop.getRestaurants);
router.get('/v1/restaurants/activity_attributes', Category.getActivity);

export default router;
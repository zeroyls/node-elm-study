'use strict';

import express from 'express';
import CityController from '../controller/v1/cities';
import SearchController from '../controller/v1/search';

const router = express.Router();

router.get('/cities', CityController.getCity);
router.get('/cities/:id', CityController.getCityById)
router.get('/pois', SearchController.search);

export default router;
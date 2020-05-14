'use strict';

import express from 'express'
import CityController from '../controller/v1/cities'


const router = express.Router();

router.get('/pois/:geohash', CityController.pois)

export default router;
'use strict';

import express from 'express'
import CityController from '../controller/v1/cities'
import EntryController from '../controller/v2/entry'

import UserController from '../controller/v2/user';


const router = express.Router();

router.get('/pois/:geohash', CityController.pois);
router.get('/index_entry', EntryController.getEntry);

export default router;
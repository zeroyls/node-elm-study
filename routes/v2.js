'use strict';

import express from 'express'
import CityController from '../controller/v1/cities'
import EntryController from '../controller/v2/entry'

import UserController from '../controller/v2/user';
import CaptchaController from '../controller/v2/captcha';

import AddressController from '../controller/v2/address';


const router = express.Router();

router.get('/pois/:geohash', CityController.pois);
router.get('/index_entry', EntryController.getEntry);


router.get('/captcha', CaptchaController.getCaptcha);
router.post('/user/login', UserController.login);
router.get('/user/signout', UserController.signout);
router.post('/user/changepassword', UserController.changePassword);

router.get('/user/list', UserController.listUser);
router.get('/user/get', UserController.getUserInfo);
router.get('/user/getcount', UserController.getUserCount);

router.post('/user/:user_id/address/add', AddressController.addAddress);
router.get('/user/address/delete', AddressController.deleteAddress);
router.get('/user/:user_id/address/list', AddressController.listAddress);


export default router;
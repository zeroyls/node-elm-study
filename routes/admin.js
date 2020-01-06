'use strict';

import express from 'express';
import AdminController from '../controller/admin/admin';

const router = express.Router();

router.post('/register', AdminController.register);
router.post('/login', AdminController.login);
router.get('/singout', AdminController.singout);
router.get('/all', AdminController.getAllAdmin);
router.get('/count', AdminController.getAdminCount);
router.get('/info', AdminController.getAdminInfo);
router.post('/update/avatar/:admin_id', AdminController.updateAvatar);



export default router;
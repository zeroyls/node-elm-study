'use strict';

import express from 'express';
import Admin from '../controller/admin/admin';

const router = express.Router();

router.post('/register', Admin.register);
router.post('/login', Admin.login);
router.get('/singout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);



export default router;
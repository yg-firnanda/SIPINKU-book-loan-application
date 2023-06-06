const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const adminAuth = require('../middleware/admin-auth')

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/login-admin', authController.getAdminLogin);
router.post('/login-admin', authController.postAdminLogin);
router.post('/logout-admin', authController.postAdminLogout);

module.exports = router;
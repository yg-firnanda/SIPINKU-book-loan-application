const express = require('express');

const router = express.Router()

const pageController = require('../controllers/pageController')

router.get('/pages/policy', pageController.getPolicy);
router.get('/pages/about', pageController.getAbout);
router.get('/pages/contact', pageController.getContact);

module.exports = router;
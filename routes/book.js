const express = require('express');

const router = express.Router();

const { isAuth } = require('../middleware/is-auth')
const bookController = require('../controllers/bookController');

router.get('/', bookController.getBooks);
// router.get('/profile', bookController.getProfile);
router.get('/book/:bookId', bookController.getBook);
router.get('/loan/:bookId', isAuth, bookController.getLoan);
router.post('/loan/:bookId', isAuth, bookController.postLoan)

module.exports = router;
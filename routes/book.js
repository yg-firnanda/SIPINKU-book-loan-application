const express = require('express');

const router = express.Router();

const { isAuth } = require('../middleware/is-auth')
const bookController = require('../controllers/bookController');

router.get('/', bookController.getIndex);
router.get('/category', bookController.getCategory);
router.get('/category/romance', bookController.getBooksRomance);
router.get('/category/history', bookController.getBooksHistory);
router.get('/category/comedy', bookController.getBooksComedy);
router.get('/category/horror', bookController.getBooksHorror);
router.get('/category/fantasy', bookController.getBooksFantasy);
router.get('/book/:bookId', bookController.getBook);
router.get('/loan/:bookId', isAuth, bookController.getLoan);
router.post('/loan/:bookId', isAuth, bookController.postLoan)


module.exports = router;
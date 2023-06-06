const express = require('express');

const router = express.Router();

const { adminAuth } = require('../middleware/admin-auth')
const adminController = require('../controllers/adminController');

router.get('/', adminController.getIndex);
router.get('/books', adminController.getBooks);
router.get('/book/:bookId', adminAuth, adminController.getBook)
router.get('/book/edit/:bookId', adminController.getEditAdminBook);
router.post('/book/edit/:bookId', adminAuth, adminController.postEditAdminBook);
router.post('/book/delete/:bookId', adminController.deleteAdminBook)
router.get('/add-book', adminAuth, adminController.getAddBook);
router.post('/add-book', adminAuth, adminController.postAddBook);
router.get('/loans', adminAuth, adminController.getLoans);
router.get('/loans/detail/:loanId', adminController.getLoansDetail);
router.post('/approve/:loanId', adminAuth, adminController.postApproveLoan);
router.post('/reject/:loanId', adminAuth, adminController.postRejectLoan);

module.exports = router;
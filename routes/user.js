const express = require('express');

const app = express();

const router = express.Router();

const { isAuth } = require('../middleware/is-auth');
const userController = require('../controllers/userController');

router.get('/profile/general', isAuth, userController.getProfileGeneral);
router.get('/profile/loans', isAuth, userController.getProfileLoans);
router.get('/loan/payment/successful/', isAuth, userController.getPaymentSuccess);
router.get('/loan/fine-payment/successful', isAuth, userController.getSuccessFinePayment);
router.get('/loan/fine-payment/:userId', isAuth, userController.getFinePayment);
router.post('/loan/fine-payment/:userId', isAuth, userController.postFinePayment);
router.get('/loan/detail/:loanId', isAuth, userController.getLoanDetail);
router.post('/loan/detail/:loanId', isAuth, userController.postLoanDetail);
router.get('/loan/payment/:loanId', isAuth, userController.getPayment);
router.post('/loan/payment/:loanId', isAuth, userController.postPayment);
router.get('/loan/return/:loanId', isAuth, userController.getReturnLoan)

module.exports = router;
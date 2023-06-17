const moment = require('moment')
const User = require('../models/User')
const Loan = require('../models/Loan');
const { remainingTime } = require('../utils/timeRemain');

exports.getProfileGeneral = (req, res) => {
    User.findOne({ _id: req.user._id })
        .then(user => {
            res.render('user/profile', {
                pageTitle: 'My Profile',
                layout: 'layouts/main-layout',
                user
            });
        })
        .catch(err => console.log(err));
};


exports.getProfileLoans = (req, res) => {
    Loan.find({ 'user.email': req.user.email })
        .populate('book')
        .lean().exec()
        .then(loans => {
            console.log(loans);
            res.render('user/loans', {
                pageTitle: 'My Loans',
                layout: 'layouts/main-layout',
                path: '/profile',
                loans,
            });
        })
        .catch(err => console.log(err));
};

exports.getLoanDetail = (req, res) => {
    const loanId = req.params.loanId
    Loan.findById(loanId)
        .populate('book')
        .lean().exec()
        .then(loan => {
            remainingTime(loan)
            res.render('user/loan-detail', {
                pageTitle: 'Detail Peminjaman',
                layout: 'layouts/main-layout',
                loan,
                remainingTime
            })
        })
}

exports.postLoanDetail = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findById(loanId)
        .then(loan => {
            if (loan.isSent === 'dikirim') {
                Loan.findByIdAndUpdate(loanId, { isSent: 'diterima', isReturn: false })
                    .then(loan => {
                        console.log("Paket diterima peminjam");
                        res.redirect(`/loan/detail/${loan._id}`);
                    })
                    .catch(err => console.log(err));
            } else if (loan.isReturn === false) {
                const currentTime = moment();
                let lateReturn = moment(loan.dueDate).isBefore(currentTime);
                Loan.findByIdAndUpdate(loanId, { isReturn: true, isLate: lateReturn }, { new: true })
                    .then(updatedLoan => {
                        if (updatedLoan.isLate === true) {
                            req.session.isFine = true;
                            console.log('terlambat mengembalikan buku');
                            res.redirect(`/loan/detail/${updatedLoan._id}`);
                        } else if (updatedLoan.isLate === false) {
                            console.log('buku dikembalikan sebelum masa tenggat');
                            res.redirect(`/loan/detail/${updatedLoan._id}`);
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}

exports.getPayment = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findById(loanId)
        .populate('book')
        .lean().exec()
        .then(loan => {
            res.render('user/payment', {
                pageTitle: 'Pembayaran',
                layout: 'layouts/main-layout',
                loan,
            });
        })
        .catch(err => console.log(err));
};

exports.postPayment = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findByIdAndUpdate(loanId, { isPaid: 'paid', isSent: 'dikemas' })
        .then(loan => {
            console.log("Buku telah dibayar");
            res.redirect('/loan/payment/successful')
        })
        .catch(err => console.log(err));
}

exports.getFinePayment = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            res.render('user/fine-payment', {
                pageTitle: 'Fine Payment',
                layout: 'layouts/main-layout',
                user
            })
        })
        .catch(err => console.log(err))
}

exports.postFinePayment = (req, res) => {
    const userId = req.params.userId;
    User.findByIdAndUpdate(userId, { isFine: false })
        .then(() => {
            req.session.isFine = false;
            console.log("Pembayaran denda berhasil");
            res.redirect('/loan/fine-payment/successful')
        })
        .catch(err => console.log(err))
}

exports.getSuccessFinePayment = (req, res) => {
    const userId = req.params.userId
    res.render('user/success-fine-payment', {
        pageTitle: 'Fine Payment Success',
        layout: 'layouts/plain-layout',
        userId
    })
}

exports.getPaymentSuccess = (req, res) => {
    res.render('user/success-payment', {
        pageTitle: 'Successful',
        layout: 'layouts/plain-layout'
    })
}

exports.getReturnLoan = (req, res) => {
    const loanId = req.params.loanId
    Loan.findById(loanId)
        .then(loan => {
            res.render('book/return-book', {
                pageTitle: 'Return Book',
                layout: 'layouts/main-layout',
                loan: loan
            })
        })
        .catch(err => console.log(err));
}
const moment = require('moment')
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const { remainingTime } = require('../utils/timeRemain')

exports.getIndex = (req, res) => {
    res.render('admin/index', {
        pageTitle: 'Admin Dashboard',
        layout: 'layouts/admin-layout'
    })
}

exports.getBooks = (req, res) => {
    Book.find()
        .then(books => {
            res.render('admin/books', {
                pageTitle: 'Koleksi Buku',
                layout: 'layouts/admin-layout',
                books: books
            })
        })
};

exports.getBook = (req, res) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
        .then(book => {
            res.render('admin/book', {
                pageTitle: 'Detail',
                layout: 'layouts/admin-layout',
                book: book
            });
        })
        .catch(err => console.log(err))
};

exports.getAddBook = (req, res) => {
    res.render('admin/add-book', {
        pageTitle: 'Add Book',
        layout: 'layouts/admin-layout'
    });
};

exports.postAddBook = (req, res) => {
    const {cover_url, title, writer, genre, description, publisher, year_release, pages, language} = req.body
    const book = new Book({ cover_url, title, writer, genre, description, publisher, year_release, pages, language });
    book.save()
        .then(result => {
            console.log("Berhasil menyimpan data buku");
            res.redirect('/admin/books');
        })
        .catch(err => console.log(err));
};

exports.getLoans = (req, res) => {
    Loan.find()
    .populate('user')
    .populate('book')
    .lean().exec()
    .then(loans => {
            loans.forEach(loan => {
                loan.remainingTime = remainingTime(loan);
            });
            res.render('admin/user-loans', {
                pageTitle: 'Loans Data',
                layout: 'layouts/admin-layout',
                loans: loans,
            })
        })
        .catch(err => console.log(err));
}

exports.getLoansDetail = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findById(loanId)
    .populate('user', 'name email role instance')
    .populate('book', 'cover_url title writer genre description publisher year_release pages language')
    .exec()
        .then(loan => {
            const loanDueDate = moment(loan.dueDate).format('DD MMMM YYYY');
            const loanDueTime = moment(loan.borrowDate).format('HH:mm')
            res.render('admin/detail-loans', {
                pageTitle: 'Loans Data',
                layout: 'layouts/admin-layout',
                loan, loanDueDate, loanDueTime
            });
        })
        .catch(err => console.log(err));
}

exports.postLoansDetail = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findByIdAndUpdate(loanId, { isSent: 'dikirim' })
        .then(loan => {
            console.log("Paket sedang dikirim");
            res.redirect(`/admin/loans/detail/${loan._id}`);
        })
        .catch(err => console.log(err));
}

exports.postApproveLoan = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findByIdAndUpdate(loanId, { isApproved: "approve", isPaid: "notPaid" })
        .then(loan => {
            const currentTime = moment();
            const paymentDuration = moment().add(1, 'day');
            const paymentOneDay = paymentDuration.diff(currentTime)

            if(paymentOneDay < 0) {
                Loan.findByIdAndUpdate(loanId, { isPaid: 'cancel' })
                    .then(() => {
                        console.log("Durasi Pembayaran Habis");
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send("Terjadi kesalahan saat memperbarui status peminjaman.");
                    });
            } else {
                console.log("Peminjaman disetujui");
                res.redirect('/admin/loans');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Terjadi kesalahan saat memperbarui status peminjaman.");
        });
};


exports.postRejectLoan = (req, res) => {
    const loanId = req.params.loanId;
    Loan.findByIdAndUpdate(loanId, { isApproved: "reject" })
        .then(() => {
            console.log('Peminjaman buku ditolak');
            res.redirect('/admin/loans');
        })
        .catch(err => console.log(err));
}

exports.getEditAdminBook = (req, res) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
        .then(book => {
            res.render('admin/edit-book', {
                pageTitle: 'Edit Book',
                layout: 'layouts/admin-layout',
                book: book
            });
        })
        .catch(err => console.log(err));
};

exports.postEditAdminBook = (req, res) => {
    const { cover_url, title, writer, genre, description, publisher, year_release, pages, language } = req.body;
    const bookId = req.params.bookId;
    Book.findByIdAndUpdate(bookId, {
        cover_url: req.body.cover_url,
        title: req.body.title,
        writer: req.body.writer,
        genre: req.body.genre,
        description: req.body.description,
        publisher: req.body.publisher,
        year_release: req.body.year_release,
        pages: req.body.pages,
        language: req.body.language
    })
    .then(() => {
        console.log("Berhasil mengedit buku");
        res.redirect('/admin/books');
    })
    .catch(err => console.log(err));
};

exports.deleteAdminBook = (req, res) => {
    const bookId = req.params.bookId;
    Book.findByIdAndDelete(bookId)
    .then(() => {
        console.log("Berhasil Menghapus");
        res.redirect('/admin/books')
    })
    .catch(err => console.log(err));
};
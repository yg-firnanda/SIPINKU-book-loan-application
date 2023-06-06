
const moment = require('moment')
require('moment/locale/id');
const User = require('../models/User');
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const { countdownRejectLoan } = require('../utils/timeRemain');

exports.getBooks = (req, res) => {
    Book.find()
        .then(books => {
            res.render('book/books', {
                pageTitle: 'Homepage',
                layout: 'layouts/main-layout',
                books: books
            });
        })
        .catch(err => console.log(err));
};

exports.getBook = (req, res) => {
    const bookId = req.params.bookId;
    let matchBook;
    Book.findById(bookId)
    .then(book => {
        matchBook = book;

        let loanQuery = { 'book._id': bookId };
        if (req.user && req.user.email) {
            // Add key-value pairs to loanQuery object
            loanQuery['user.email'] = req.user.email;
        }

        return Loan.findOne(loanQuery);
    })
    .then(loan => {
        if(!req.user) {
            if(loan) {
                loan.isApproved = null;
            }
        }
        res.render('book/book', {
            pageTitle: "Detail Page",
            layout: 'layouts/main-layout',
            book: matchBook,
            loanApprove: loan ? loan.isApproved : null
        })
    })
    .catch(err => console.log(err));
}

exports.getProfile = (req, res) => {
    res.render('book/profile', {
        pageTitle: 'My Profile',
        layout: 'layouts/main-layout'
    });
};

exports.getLoan = (req, res) => {
    const date = moment().toDate();
    const dateNow = moment(date).format('DD MMMM YYYY, HH:mm');
    const minDate = moment().format('YYYY-MM-DD');
    const maxDate = moment().add(1, 'year').format('YYYY-MM-DD');

    const userName = req.user.name;
    const userEmail = req.user.email;
    const bookId = req.params.bookId;

    Book.findById(bookId)
        .then(book => {
            if(!book) {
                return res.redirect(404).res.render('error404', {
                    pageTitle: 'Book Not Found',
                    layout: 'layouts/plain-layout'
                })
            }
            // Finding user if loan a book
            res.render('book/loan', {
                pageTitle: 'Loans',
                layout: 'layouts/main-layout',
                pageUrl: '/book/loan._id',
                book, dateNow, minDate, maxDate,
                userName, userEmail
            });
        })
        .catch(err => console.log(err))
    }
;

exports.postLoan = (req, res) => {
    const userId = req.user._id
    const bookId = req.params.bookId;
    const {descriptionOfNeeds, borrowDate, dueDate } = req.body;

    Promise.all([
        User.findById(userId).lean().exec(),
        Book.findById(bookId).lean().exec()
    ])
    .then(([user, book]) => {
        const loan = new Loan({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                agency: user.agency,
                password: user.password
            },
            book: {
                _id: book._id,
                cover_url: book.cover_url,
                title: book.title,
                writer: book.writer,
                genre: book.genre,
                description: book.description,
                publisher: book.publisher,
                year_release: book.year_release,
                pages: book.pages,
                language: book.language
            },
            descriptionOfNeeds,
            borrowDate,
            dueDate,
            isApproved: null
        });
        return loan.save()
    })
    .then(result => {
        console.log("Peminjaman Diajukan");
        res.redirect(`/book/${bookId}`)
    })
    .catch(err => console.log(err));
}
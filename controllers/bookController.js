
const moment = require('moment')
require('moment/locale/id');
const User = require('../models/User');
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const { countdownRejectLoan } = require('../utils/timeRemain');

exports.getIndex = (req, res) => {
    const categories = [
        { genre: 'Romance', limit: 4 },
        { genre: 'Comedy', limit: 4 },
        { genre: 'Horor', limit: 4 },
        { genre: 'Fantasy', limit: 4 },
        { genre: 'History', limit: 4 }
    ];

    const categoryPromises = categories.map(category => {
        return Book.find({ genre: category.genre }).limit(category.limit);
    });

    Promise.all(categoryPromises)
        .then(categoryBook => {
            res.render('book/index', {
                pageTitle: 'Homepage',
                layout: 'layouts/main-layout',
                path: '/',
                categoryBook
            });
        })
        .catch(err => console.log(err));
};

exports.getBooks = (req, res) => {
    res.render('book/books', {
        pageTitle: 'Koleksi Buku',
        layout: 'layouts/main-layout',
        path: '/koleksi'
    });
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

        // return Loan.findOne(loanQuery);
        return Loan.findById(bookId);
    })
    .then(loan => {
        // When user dont login and when user not loan anything yet, then we set the value to "loan"
        if(!req.user) {
            if(loan) {
                loan.isApproved = "loan";

                const currenTime = moment();
                const borrowDate = moment(loan.borrowDate)
                if(currenTime.isAfter(borrowDate)) {
                    loan.isApproved = "loan"
                }
            }
        }

        const timeADay = moment(loan ? loan.borrowDate : '').add(1, 'days').calendar({
            sameDay: '[hari ini pukul] HH:mm',
            nextDay: '[besok pada pukul] HH:mm'
        });
        
        res.render('book/book', {
            pageTitle: "Detail Page",
            layout: 'layouts/main-layout',
            path: `/book/${matchBook._id}`,
            book: matchBook,
            loanApprove: loan ? loan.isApproved : "loan",
            timeADay, 
        });
    })
    .catch(err => console.log(err));
}

exports.getLoan = (req, res) => {
    const date = moment().toDate();
    const dateNow = moment(date).format('DD MMMM YYYY, HH:mm');
    const minDate = moment().format('YYYY-MM-DD');
    const maxDate = moment().add(1, 'year').format('YYYY-MM-DD');

    const userName = req.user.name;
    const userEmail = req.user.email;
    const userAddress = req.user.address;
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
                path: `/loan/${book._id}`,
                book, dateNow, minDate, maxDate,
                userName, userEmail, userAddress
            });
        })
        .catch(err => console.log(err))
}

exports.postLoan = (req, res) => {
    const userId = req.user._id
    const bookId = req.params.bookId;
    const {descriptionOfNeeds, borrowDate, dueDate } = req.body;

    Promise.all([
        User.findById(userId).lean().exec(),
        Book.findById(bookId).lean().exec()
    ])
    .then(([user, book]) => {
        const currentDate = moment();
        const selectedDate = moment(dueDate, 'YYYY-MM-DD');
        selectedDate.set({
            hour: currentDate.hour(),
            minute: currentDate.minute()
        });
        const loan = new Loan({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                agency: user.agency,
                address: user.address,
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
            dueDate: selectedDate.toDate(),
            isApproved: "pending"
        });
        return loan.save()
    })
    .then(result => {
        console.log("Peminjaman Diajukan");
        // res.redirect(`/book/${bookId}`);
        res.redirect('/profile/loans')
    })
    .catch(err => console.log(err));
}

exports.getCategory = (req, res) => {
    const categories = [
        { genre: 'Romance', limit: 1 },
        { genre: 'Comedy', limit: 1 },
        { genre: 'Horor', limit: 1 },
        { genre: 'Fantasy', limit: 1 },
        { genre: 'History', limit: 1 }
    ];

    const categoryPromise = categories.map(category => {
        return Book.find({ genre: category.genre }).limit(category.limit);
    });
    Promise.all(categoryPromise)
        .then(books => {
            res.render('book/category', {
                pageTitle: 'Kategori Buku',
                layout: 'layouts/main-layout',
                books
            })
        })
        .catch(err => console.log(err))
}

// GET BOOKS BY GENRE

exports.getBooksRomance = (req, res) => {
    let bookGenre;
    Book.find({ 'genre': 'Romance' })
        .then(books => {
            books.forEach(book => {
                bookGenre = book.genre
            })
            res.render('book/books', {
                pageTitle: 'Genre Romansa',
                layout: 'layouts/main-layout',
                books, bookGenre
            });
        })
        .catch(err => console.log(err));
}

exports.getBooksHistory = (req, res) => {
    let bookGenre;
    Book.find({ 'genre': 'Horor' })
        .then(books => {
            books.forEach(book => {
                bookGenre = book.genre
            })
            res.render('book/books', {
                pageTitle: 'Genre Horror',
                layout: 'layouts/main-layout',
                books, bookGenre
            });
        })
        .catch(err => console.log(err));
}

exports.getBooksComedy = (req, res) => {
    let bookGenre;
    Book.find({ 'genre': 'Comedy' })
        .then(books => {
            books.forEach(book => {
                bookGenre = book.genre
            })
            res.render('book/books', {
                pageTitle: 'Genre Komedi',
                layout: 'layouts/main-layout',
                books, bookGenre
            });
        })
        .catch(err => console.log(err));
}

exports.getBooksFantasy = (req, res) => {
    let bookGenre;
    Book.find({ 'genre': 'Fantasy' })
        .then(books => {
            books.forEach(book => {
                bookGenre = book.genre
            })
            res.render('book/books', {
                pageTitle: 'Genre Fantasi',
                layout: 'layouts/main-layout',
                books, bookGenre
            });
        })
        .catch(err => console.log(err));
}

exports.getBooksHorror = (req, res) => {
    let bookGenre;
    Book.find({ 'genre': 'History' })
        .then(books => {
            books.forEach(book => {
                bookGenre = book.genre
            })
            res.render('book/books', {
                pageTitle: 'Genre Sejarah',
                layout: 'layouts/main-layout',
                books, bookGenre
            });
        })
        .catch(err => console.log(err));
}
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://127.0.0.1/book-loan';

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: { },
    store: store
}));

const User = require('./models/User');
const Book = require('./models/Book');

// User loggedIn Middleware
app.use((req, res, next) => {
    if(req.session.user) {
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err));
    } else {
        next();
    }
})

// User authenticated middleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

require('./utils/database')
const errorController = require('./controllers/errorController')
const bookRoutes = require('./routes/book');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use(bookRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);

app.get('*', errorController.get404);

app.listen(process.env.PORT || PORT);
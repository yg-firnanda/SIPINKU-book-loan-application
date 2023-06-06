const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Signup Page',
        layout: 'layouts/plain-layout'
    })
}

exports.postSignup = (req, res) => {
    const { name, email, role, agency, password, confPassword } = req.body;
    if (password === confPassword) {
        User.findOne({ email })
            .then(matchEmail => {
                if (matchEmail) {
                    console.log('Email sudah ada');
                    return res.redirect('/signup');
                }
                return bcrypt.hash(password, 12);
            })
            .then(hashedPassword => {
                const user = new User({ name, email, role, agency, password: hashedPassword });
                return user.save();
            })
            .then(result => {
                console.log("Berhasil daftar sebagai pengguna");
                res.redirect('/login');
            })
            .catch(err => console.log(err));
    } else {
        console.log('Password tidak sama');
        res.redirect('/signup');
    }
}

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login Page',
        layout: 'layouts/plain-layout'
    })
}

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    let foundUser;
    User.findOne({ email })
        .then(matchUser => {
            if(!matchUser) {
                console.log('Invalid email!');
                return res.redirect('/login');
            }
            foundUser = matchUser;
            return bcrypt.compare(password, matchUser.password)
        })
        .then(user => {
            if(user) {
                req.session.isLoggedIn = true;
                req.session.user = foundUser;
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                })
            } else {
                console.log("Password tidak sesuai");
                res.redirect('/login');
            }
        })
        .catch(err => console.log(err));
}

exports.getAdminLogin = (req, res) => {
    res.render('auth/login-admin', {
        pageTitle: 'Admin Login Page',
        layout: 'layouts/plain-layout'
    })
}

exports.postAdminLogin = (req, res) => {
    const { email, password } = req.body;
    if( email === "admin@gmail.com" && password === "12345" ) {
        req.session.adminLoggedIn = true;
        res.redirect('/admin');
    } else {
        res.redirect('/');
    }
}

exports.postAdminLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}
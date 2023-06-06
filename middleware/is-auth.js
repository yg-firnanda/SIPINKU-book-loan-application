exports.isAuth = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/');
    }
    next()
}
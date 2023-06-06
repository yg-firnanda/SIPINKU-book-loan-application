exports.adminAuth = (req, res, next) => {
    if(!req.session.adminLoggedIn) {
        return res.redirect('/');
    }
    next();
}
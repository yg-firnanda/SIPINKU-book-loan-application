exports.get404 = (req, res) => {
    res.render('error404', {
        pageTitle: 'Error',
        layout: 'layouts/error-layout'
    })
}
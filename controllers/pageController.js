exports.getAbout = (req, res) => {
    res.render('pages/about', {
        pageTitle: 'About Page',
        layout: 'layouts/main-layout'
    });
};

exports.getContact = (req, res) => {
    res.render('pages/contact', {
        pageTitle: 'Contact Page',
        layout: 'layouts/main-layout'
    });
};

exports.getPolicy = (req, res ) => {
    res.render('pages/policy', {
        pageTitle: 'Policy Page',
        layout: 'layouts/main-layout'
    });
};
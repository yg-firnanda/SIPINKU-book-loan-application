const mongoose = require('mongoose');

const database = mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DATABASE_NAME}`)
    .then(result => {
        console.log('Connected!');
    })
    .catch(err => console.log(err));

module.exports = database;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    cover_url: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    writer: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    publisher: {
        type: String,
        require: true
    },
    year_release: {
        type: Number,
        require: true
    },
    pages: {
        type: Number,
        require: true
    },
    language: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Book', bookSchema);
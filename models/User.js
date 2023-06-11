const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    agency: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isFine: {
        type: String,
        default: false
    },
    loans: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ]
});

module.exports = mongoose.model('User', userSchema);

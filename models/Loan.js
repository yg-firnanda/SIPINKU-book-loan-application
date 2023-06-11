const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loanSchema = new Schema({
    user: {
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
        password: {
            type: String,
            required: true
        }
    },
    book: {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
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
        }
    },
    descriptionOfNeeds: {
        type: String,
        required: true
    },
    borrowDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    isApproved: {
        type: String,
        enum: ['loan', 'pending', 'reject', 'approve'],
        default: 'loan'
    },
    isPaid: {
        type: String,
        enum: ['null', 'paid', 'notPaid', 'cancel'],
        default: 'null'
    },
    isSent: {
        type: String,
        enum: ['null', 'dikemas', 'dikirim', 'diterima'],
        default: 'null'
    },
    isReturn: {
        type: Boolean,
        default: null
    },
    isLate: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Loan', loanSchema);
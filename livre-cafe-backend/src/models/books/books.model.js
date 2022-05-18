const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    author: {
        type: String, 
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

Books = mongoose.model('books', BooksSchema);

module.exports = Books;

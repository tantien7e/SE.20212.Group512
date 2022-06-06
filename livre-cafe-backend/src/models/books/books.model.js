const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    
    title: {
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

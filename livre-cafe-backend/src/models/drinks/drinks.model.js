const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DrinksSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },

    name: {
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

Drinks = mongoose.model('drinks', DrinksSchema);

module.exports = Drinks;
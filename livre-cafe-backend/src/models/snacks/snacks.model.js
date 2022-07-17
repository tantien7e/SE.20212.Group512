const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SnacksSchema = new Schema({
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

Snacks = mongoose.model('snacks', SnacksSchema);

module.exports = Snacks;
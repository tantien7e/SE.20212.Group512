const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
	
    email: {
        type: String, 
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ['male', 'female', ''],
        required: true
    },

    exchangeablePoints: {
        type: Number,
        default: 0
    },

    rankingPoints: {
        type: Number,
        default: 0
    },

    ranking: {
        type: String,
        enum: ['silver', 'gold', 'platinum', 'diamond'],
        default: 'silver'
    },
    
	order: {
		type: Schema.Types.ObjectId,
        ref: 'orders'
	},

    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'reservations'
    },

    ordersHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        }
    ],

    reservationsHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'reservations'
        }
    ]
},
    {
        timestamps: true
    }
);

Customer = mongoose.model('customers', CustomerSchema);

module.exports = Customer;
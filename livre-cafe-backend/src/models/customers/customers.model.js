const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: {
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

    point: {
        type: Number,
        default: 0
    },
    
	order: {
		type: Schema.Types.ObjectId,
        ref: 'orders'
	},

    ordersHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        }
    ]
},
    {
        timestamps: true
    }
);

Customer = mongoose.model('customers', CustomerSchema);

module.exports = Customer;
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
        required: true
    }
	order: {
		type: Schema.Types.ObjectId,
        refPath: 'Order'
	}
});

Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;
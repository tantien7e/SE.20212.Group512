const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({

    items: [
        {
            productType: {
                type: String,
                required: true
            },

            product: {
                type: Schema.Types.ObjectId,
                refPath: 'items.productType'
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    status: {
        type: String,
        required: true
    },

    // customer: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Customer'
    // }


},
    {
        timestamps: true
    }
);

Orders = mongoose.model('orders', OrdersSchema);

module.exports = Orders;
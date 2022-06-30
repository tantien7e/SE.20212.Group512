const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({

    itemsOrdered: [
        {
            productType: {
                type: String,
                enum: ['books', 'drinks'],
                required: true
            },

            product: {
                type: Schema.Types.ObjectId,
                refPath: 'itemsOrdered.productType'
            },

            quantity: {
                type: Number,
                required: true
            },

            additionalRequirements: {
                type: String
            }
        }
    ],

    status: {
        type: String,
        enum: ["processing", "completed", "cancelled"],
        required: true
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customers'
    },

    totalCost: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
);

Orders = mongoose.model('orders', OrdersSchema);

module.exports = Orders;
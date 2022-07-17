const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
    start: {
        type: Date
    },

    end: {
        type: Date
    },

    area: {
        type: Schema.Types.ObjectId
    },

    itemsOrdered: [
        {
            productType: {
                type: String,
                enum: ['drinks', 'snacks'],
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

    customer: {
        type: Schema.Types.ObjectId
    },

    status: {
        type: String,
        enum: ['pending', 'checked in', 'checked out']
    },

    totalCost: {
        type: Number
    }
},
    {
        timestamps: true
    }
);

const Reservations = mongoose.model('reservations', ReservationsSchema);

module.exports = Reservations;
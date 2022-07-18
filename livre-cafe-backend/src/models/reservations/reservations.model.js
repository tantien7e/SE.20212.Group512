const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
    startTime: {
        type: Date
    },

    duration: {
        type: Number
    },

    area: {
        type: Schema.Types.ObjectId,
        ref: 'areas'
    },

    numberOfPeople: {
        type: Number
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled'],
        default: 'pending'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders'
    }
},
    {
        timestamps: true
    }
);

const Reservations = mongoose.model('reservations', ReservationsSchema);

module.exports = Reservations;
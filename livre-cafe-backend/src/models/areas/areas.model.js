const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreasSchema = new Schema({
    costPerHour: {
        type: Number
    },

    status: {
        type: String,
        enum: ['free', 'occupied'],
        default: 'free'
    },

    capacity: {
        type: Number
    },

    reservations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'reservations' 
        }
    ]
});

const Areas = mongoose.model('areas', AreasSchema);

module.exports = Areas;
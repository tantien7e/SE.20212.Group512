const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const VouchersSchema = new Schema({
    correspondingRank: {
        type: String,
        enum: ['silver', 'gold', 'platinum', 'diamond']
    },

    pointsCost: {
        type: Number
    },

    name: {
        type: String
    },
    
    available: {
        type: Boolean,
        default: true
    },

    percentageDiscount: {
        type: Number
    },

    maxAmount: {
        type: Number
    }
});

const Vouchers = mongoose.model('vouchers', VouchersSchema);

module.exports = Vouchers;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffsSchema = new Schema({
    username: {
        type: String,
    },

    firstName: {
        type: String,
        require: true
    },

    lastName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    ordersHandled: [
        {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
    ],

    salt: {
        type: String,
    },

    isManager: {
        type: Boolean,
        default: false
    },

    accountActivated: {
        type: Boolean,
        default: false
    }
});

const Staffs = mongoose.model('staffs', StaffsSchema);

module.exports = Staffs;
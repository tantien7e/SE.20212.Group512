const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffsSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    hash: {
        type: String,
        required: true
    },

    salt: {
        type: String,
        required: true
    },

    isManager: {
        type: Boolean,
        default: false
    }
});

const Staffs = mongoose.model('staffs', StaffsSchema);

module.exports = Staffs;
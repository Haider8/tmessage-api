const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
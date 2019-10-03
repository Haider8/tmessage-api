const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    user_name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    displayed_name: String
});
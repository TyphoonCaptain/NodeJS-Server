const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    surname: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, unique: true, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/},
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
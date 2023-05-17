const mongoose = require('mongoose');
const { options } = require('../routes/users');
const currentDate = new Date(); 
const requestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    requestType: {type: String, required: true},
    requestQuantity: {type: Number, default: 1},
    location: {
        X: {type: Number, required: true},
        Y: {type: Number, required: true}
    },
    requestDate: {type: String, default: () => {return currentDate.toLocaleDateString(undefined, options);}},
    requestTime: {type: String, default: () => {return currentDate.toLocaleTimeString('en-US');}}
});

module.exports = mongoose.model('Request', requestSchema);
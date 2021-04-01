const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var customerUserSchema = new mongoose.Schema({
    type: String,
    username: String,
    password: String
});

customerUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('customerUser', customerUserSchema);
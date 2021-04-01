const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var adminUserSchema = new mongoose.Schema({
    type: String,
    username: String,
    password: String
});

adminUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('adminUser', adminUserSchema);
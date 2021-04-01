const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var employeeUserSchema = new mongoose.Schema({
    type: String,
    username: String,
    password: String
});

employeeUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('employeeUser', employeeUserSchema);
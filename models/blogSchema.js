const mongoose = require('mongoose');

const customerBlogSchema = new mongoose.Schema({
    title: String,
    body: String,
    isApproved: false,
    isVerified: false,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerBlog', customerBlogSchema);

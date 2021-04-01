const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CustomerBlog', blogSchema);

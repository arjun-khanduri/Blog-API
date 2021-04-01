const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const customerBlog = require('./models/blogSchema');

mongoose.connect("mongodb://localhost:27017/Blog-API", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const role = req.body.type;
    res.redirect('/' + role);
});

app.get('/customer', (req, res) => {
    customerBlog.find({}, (err, foundBlogs) => {
        if (err)
            console.log(err);
        else
            res.render('customer', { blogs: foundBlogs });
    });

});

app.get('/customer/new', (req, res) => {
    res.render('new');
});

app.post('/customer/new', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const isVerified = false;
    const isApproved = false;
    const blog = { title: title, body: body, isApproved: isApproved, isVerified: isVerified };
    customerBlog.create(blog, (err, newBlog) => {
        if (err)
            res.render('new');
        else
            res.redirect('/customer');
    });
});

app.get('/customer/:id', (req, res) => {
    customerBlog.findById(req.params.id, (err, foundBlog) => {
        if (err)
            res.redirect('/customer');
        else
            res.render('show', { blog: foundBlog, title: foundBlog.title });
    });
});


app.get('/admin', (req, res) => {
    customerBlog.find({ isApproved: false }, (err, foundBlogs) => {
        if (err)
            console.log(err);
        else
            res.render('admin', { blogs: foundBlogs });
    });
});

app.get('/admin/:id/approve', (req, res) => {
    const approved = { $set: { isApproved: true} };
    customerBlog.findByIdAndUpdate(req.params.id, approved, (err, foundBlogs) => {
        res.redirect('/admin');
    });
});

app.get('/employee', (req, res) => {
    res.send('Employee page');
});

app.listen(8000, (req, res) => {
    console.log('Server listening at port 8000');
});
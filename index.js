const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.static('public'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));


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
    res.send('Customer page');
});

app.get('/admin', (req, res) => {
    res.send('Admin page');
});

app.get('/employee', (req, res) => {
    res.send('Employee page');
});

app.listen(8000, (req, res) => {
    console.log('Server listening at port 8000');
});
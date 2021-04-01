const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.static('public'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.send('Landing page');
})

app.listen(8000, (req, res) => {
    console.log('Server listening at port 8000');
})
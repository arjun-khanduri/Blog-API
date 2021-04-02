const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const Blog = require('./models/blogSchema');
const adminUser = require('./models/adminUserSchema');
const customerUser = require('./models/customerUserSchema');
const employeeUser = require('./models/employeeUserSchema');

mongoose.connect("mongodb://localhost:27017/Blog-API", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: "Sample Hash",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use('adminLocal', new LocalStrategy(adminUser.authenticate()));
passport.use('customerLocal', new LocalStrategy(customerUser.authenticate()));
passport.use('employeeLocal', new LocalStrategy(employeeUser.authenticate()));

passport.serializeUser((user, done) => {
    const type = user.type;
    return done(null, { id: user.id, type: type });
});

passport.deserializeUser((user, done) => {
    if (user.type === 'Admin') {
        adminUser.findById(user.id, (err, user) => {
            done(err, user);
        });
    }
    if (user.type === 'Customer') {
        customerUser.findById(user.id, (err, user) => {
            done(err, user);
        });
    }
    if (user.type === 'Employee') {
        employeeUser.findById(user.id, (err, user) => {
            done(err, user);
        });
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

isLoggedInAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'Admin')
        return next();
    res.redirect('/login/admin');
}

isLoggedInEmployee = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'Employee')
        return next();
    res.redirect('/login/employee');
}

isLoggedInCustomer = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'Customer')
        return next();
    res.redirect('/login/customer');
}


app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/login/admin', (req, res) => {
    res.render('admin_login');
});

app.get('/login/customer', (req, res) => {
    res.render('customer_login');
});

app.get('/login/employee', (req, res) => {
    res.render('employee_login');
});

app.post('/login/admin', passport.authenticate('adminLocal',
    {
        successRedirect: '/admin',
        failureRedirect: '/login/admin'
    }), (req, res) => {

    });

app.post('/login/employee', passport.authenticate('employeeLocal',
    {
        successRedirect: '/employee',
        failureRedirect: '/login/employee'
    }), (req, res) => {

    });

app.post('/login/customer', passport.authenticate('customerLocal',
    {
        successRedirect: '/customer',
        failureRedirect: '/login/customer'
    }), (req, res) => {

    });

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const type = req.body.type;
    const p1 = req.body.password1;
    const p2 = req.body.password;
    if (p1 === p2) {
        if (type === 'Customer') {
            const newUser = new customerUser({ username: req.body.username, type: 'Customer' });;
            customerUser.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    req.flash('error', err.message);
                    res.redirect('/signup');
                }
                else {
                    passport.authenticate('customerLocal')(req, res, () => {
                        req.flash('success', 'Welcome, ' + req.user.username + '!');
                        res.redirect('/customer');
                    });
                }
            });
        }

        else if (type === 'Admin') {
            const newUser = new adminUser({ username: req.body.username, type: 'Admin' });
            adminUser.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    req.flash('error', err.message);
                    res.redirect('/');
                }
                else {
                    passport.authenticate('adminLocal')(req, res, () => {
                        req.flash('success', 'Welcome, ' + req.user.username + '!');
                        res.redirect('/admin');
                    });
                }
            });
        }

        else if (type === 'Employee') {
            const newUser = new employeeUser({ username: req.body.username, type: 'Employee' });
            employeeUser.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    req.flash('error', err.message);
                    res.redirect('/');
                }
                else {
                    passport.authenticate('employeeLocal')(req, res, () => {
                        req.flash('success', 'Welcome, ' + req.user.username + '!');
                        res.redirect('/employee');
                    });
                }
            });
        }
    }
    else {
        req.flash('error', 'Passwords do not match');
        res.redirect('/signup');
    }

});

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/');
})


app.get('/customer', isLoggedInCustomer, (req, res) => {
    Blog.find({ author: { id: req.user._id, username: req.user.username } }, (err, foundBlogs) => {
        if (err)
            console.log(err);
        else
            res.render('customer', { blogs: foundBlogs, name: req.user.username });
    });
});

app.get('/customer/new', isLoggedInCustomer, (req, res) => {
    res.render('new', { name: req.user.username });
});

app.post('/customer/new', isLoggedInCustomer, (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const isVerified = false;
    const isApproved = false;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const blog = { title: title, body: body, isApproved: isApproved, isVerified: isVerified, author: author };
    Blog.create(blog, (err, newBlog) => {
        if (err)
            res.render('new');
        else
            res.redirect('/customer');
    });
});

app.get('/customer/:id', isLoggedInCustomer, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err)
            res.redirect('/customer');
        else
            res.render('show', { blog: foundBlog, title: foundBlog.title });
    });
});


app.get('/admin', isLoggedInAdmin, (req, res) => {
    Blog.find({ isVerified: false, isApproved: false }, (err, foundBlogs) => {
        if (err)
            console.log(err);
        else
            res.render('admin', { blogs: foundBlogs });
    });
});

app.get('/admin/:id/approve', isLoggedInAdmin, (req, res) => {
    const approved = { $set: { isApproved: true } };
    Blog.findByIdAndUpdate(req.params.id, approved, (err, foundBlogs) => {
        res.redirect('/admin');
    });
});

app.get('/employee', isLoggedInEmployee, (req, res) => {
    Blog.find({ isApproved: true, isVerified: false }, (err, foundBlogs) => {
        if (err)
            console.log(err);
        else
            res.render('employee', { blogs: foundBlogs, name: req.user.username });
    });
});

app.get('/employee/:id/verify', isLoggedInEmployee, (req, res) => {
    const verified = { $set: { isVerified: true } };
    Blog.findByIdAndUpdate(req.params.id, verified, (err, foundBlogs) => {
        res.redirect('/employee');
    });
});

app.listen(8000, (req, res) => {
    console.log('Server listening at port 8000');
});
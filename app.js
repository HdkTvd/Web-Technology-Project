const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport1 = require('passport');
const passport2 = require('passport');
const videos = require('./models/videos')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const nodemailer = require('nodemailer')
const multer = require('multer')
var assert = require('assert')
const ejs_lint=require('ejs-lint');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

var videopath = ''
var Description = ''

// DB Config
const db = 'mongodb://localhost:27017/prac';

// Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true }).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport1 = require('passport');
const passport2 = require('passport');
const passport=require('passport');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs_lint=require('ejs-lint');
// Load User model
const app=require('../app')
const Student = require('../models/Student');
const Instructor=require('../models/Instructor');
const videos = require('../models/videos');
const { forwardAuthenticated } = require('../config/auth');


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var videopath = ''
var Description = ''
var teacherid;


router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:5000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

// Login Page
router.get('/student-login', forwardAuthenticated, (req, res) => res.render('student-login'));

router.get('/instructor-login', forwardAuthenticated, (req, res) => res.render('instructor-login'));

router.get('/student-register', forwardAuthenticated, (req, res) => res.render('student-register'));

router.get('/instructor-register', forwardAuthenticated, (req, res) => res.render('instructor-register'));

router.post('/newCourse', (req, res) => {
const { idi,iname,cname } = req.body;
const newCourse = new Course({idi, iname, cname});
newCourse.save().then(Course => {
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  }).catch(err => console.log(err));
});

// Register
router.post('/student-register', (req, res) => {


  const { name, email, password, password2 } = req.body;
 let errors = [];

 if (!name || !email || !password || !password2) {
   errors.push({ msg: 'Please enter all fields' });
 }

 if (password != password2) {
   errors.push({ msg: 'Passwords do not match' });
 }

 if (password.length < 6) {
   errors.push({ msg: 'Password must be at least 6 characters' });
 }

 if (errors.length > 0) {
   res.render('student-register', {
     errors,
     name,
     email,
     password,
     password2
   });
 } else {
   Student.findOne({ email: email }).then(user => {
     if (user) {
       errors.push({ msg: 'Email already exists' });
       res.render('student-register', {
         errors,
         name,
         email,
         password,
         password2
       });
     } else {
       const newUser = new Student({
         name,
         email,
         password
       });

         newUser
             .save()
             .then(user => {
               req.flash(
                 'success_msg',
                 'You are now registered and can log in'
               );
               
               let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'alok5633y@gmail.com',
      pass: 'aloky@1234'
    }
  });
  let mailOptions = {
    from: '"Alok Yadav" <alok5633y@gmail.com>',
    to: req.body.email,
    subject: "Welcome to Courses.com",
   text: "Welcome "+req.body.name+". We are very glad to inform you that you have successfully registered as the student at Courses.com. Enjoy Learning!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error){
      return console.log(error);
    }
    else{
      console.log("Email sent successfully");
      console.log(mailOptions.to);
    }
  });



               res.redirect('/users/student-login');
             })
             .catch(err => console.log(err));
        
     }
   });
 }
});

router.post('/instructor-register', (req, res) => {


  const { name, email, password, password2 } = req.body;
 let errors = [];

 if (!name || !email || !password || !password2) {
   errors.push({ msg: 'Please enter all fields' });
 }

 if (password != password2) {
   errors.push({ msg: 'Passwords do not match' });
 }

 if (password.length < 6) {
   errors.push({ msg: 'Password must be at least 6 characters' });
 }

 if (errors.length > 0) {
   res.render('instructor-register', {
     errors,
     name,
     email,
     password,
     password2
   });
 } else {
   Instructor.findOne({ email: email }).then(user => {
     if (user) {
       errors.push({ msg: 'Email already exists' });
       res.render('instructor-register', {
         errors,
         name,
         email,
         password,
         password2
       });
     } else {
       const newUser = new Instructor({
         name,
         email,
         password
       });

        newUser
             .save()
             .then(user => {
               req.flash(
                 'success_msg',
                 'You are now registered and can log in'
               );

              let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'alok5633y@gmail.com',
      pass: 'aloky@1234'
    }
  });
  let mailOptions = {
    from: '"Alok Yadav" <alok5633y@gmail.com>',
    to: req.body.email,
    subject: "Welcome to Courses.com",
   text: "Welcome "+req.body.name +". We are very glad to inform you that you have successfully registered as the teacher at Courses.com. Enjoy Teaching!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error){
      return console.log(error);
    }
    else{
      console.log("Email sent successfully");
      console.log(mailOptions.to);
    }
  });



              


               res.redirect('/users/instructor-login');
             })
             .catch(err => console.log(err));

       
     }
   });
 }
});


// Login

router.post('/student-login', (req, res, next) => {

  var password = req.body.password;
  var email = req.body.email;
  
  Student.findOne({ "password": password, "email": email} , function (err, result) {
    console.log(result);
    console.log(password);
    if(result){
      videos.find().distinct('course_name',function(err,result){
        console.log(typeof result[0]);
        console.log(result[0]);
        res.render('D:\\H@rDR0cK\\Projects\\WT Alok\\WT-project\\views\\courses.ejs',{result});
      });
    }
    else{
      res.render('../views/student-login.ejs');
    }
  });
});

router.post('/instructor-login', (req, res, next) => {

  var password = req.body.password;
  var email = req.body.email;

  Instructor.findOne({ "password": password, "email": email} , function (err, result) {
    console.log(result);
    console.log(password);
    if(result){
      teacherid = result._id;
      videos.find({'teacherid': teacherid}, function(err, result) {
        if(err) throw err;
        res.render('../views/teacher_registration.ejs', {result});
      })
    }
    else{
      res.render('../views/instructor-login.ejs');
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.render('../views/welcome.ejs');
});

// Multer configuration for single file uploads

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'D:\\H@rDR0cK\\Projects\\WT Alok\\WT-project\\public\\Courses videos\\')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname )
    }
});

var upload = multer({ storage: storage });

// Route for file upload
router.post('/upload', upload.single('videofile'), (req, res, next) => {
  insertDocuments(req.body.video_no, req.body.coursename, req.body.videoname, req.body.description,'D:\\H@rDR0cK\\Projects\\WT Alok\\WT-project\\public\\Courses videos\\' + req.file.filename, () => {
    console.log("File uploaded to db successfully!");
  });
  res.sendFile(path.join(__dirname+'/../views/teacher_registration.ejs'))
});

var insertDocuments = function(/*teacherId, filename,*/video_no, coursename, video_name, Description, filePath) {
  var videorecord = new videos({ video_no:video_no, course_name:coursename, videoPath: filePath, description: Description, name: video_name, teacherid: teacherid}); 
  videorecord.save(function(err) {
    if (err) throw err;
    console.log("video saved successfully");
  });
}

router.post('/registered', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/teacher_registration.ejs'));
});

router.post('/video', function(req, res){
  var content;
  var videono=req.body.videobutton;
  var coursename=req.body.coursename;
  videos.findOne({ $or:[{ $and:[{'video_no': videono}, {'teacherid': teacherid}]}, {$and:[{'video_no': videono}, {'course_name': coursename}]}]}, function (err, result){
    if (err) throw err;
    console.log(videono)
    console.log(teacherid);
    videopath = result.videoPath;
    console.log(coursename)
    console.log(videopath);
    content ={"Description": result.description};
    res.render('D:\\H@rDR0cK\\Projects\\WT Alok\\WT-project\\views\\video.ejs', content);
  });
});

router.get('/displayVideo', function(req, res){
  console.log(videopath);  
  const stat = fs.statSync(videopath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(videopath, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } 
  else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(videopath).pipe(res)
   }
});

router.post('/coursevideos',function(req,res){
    var coursename=req.body.videobutton;
    videos.find({'course_name':coursename},function(err,result){
      if(err)  return console.log(err);
      res.render('D:\\H@rDR0cK\\Projects\\WT Alok\\WT-project\\views\\coursevideos.ejs',{result});
  });
});

module.exports = router;

// app.js
const express = require('express')
const videos = require('./schemas/videos')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const multer = require('multer')
var assert = require('assert')
const port =  process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

var db;

var videopath = ''
var Description = ''

var connectToServer = function(){
    mongoose.connect('mongodb://localhost:27017/prac', {useNewUrlParser: true});

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log("Connection Successful")
    });
}

connectToServer();

app.listen(port , function () {
	console.log('Site is active on http://localhost:' + port);
});

// Allows cross-origin domains to access this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:8000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

// BodyParser middleware
app.use(bodyParser.json());

// Multer configuration for single file uploads

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'D:\\H@rDR0cK\\Others\\Projects\\Web Technology Project\\public\\Courses videos\\')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('videofile'), (req, res, next) => {
    insertDocuments(/*req.body.teacherid, req.file.filename,*/req.body.description, 'D:\\H@rDR0cK\\Others\\WT_proj_prac\\Courses videos\\' + req.file.filename, () => {
        console.log("File uploaded to db successfully!");
    });
    res.sendFile(path.join(__dirname + '/views/index.html'))
});

var insertDocuments = function(/*teacherId, filename,*/ Description, filePath) {
    var videorecord = new videos({videoPath: filePath, description: Description, name: "hello", teacherid: "t1"}); 
    videorecord.save(function(err) {
        if (err) throw err;
        console.log("video saved successfully");
    });
}

app.post('/registered', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/registered.html'));
});



app.post('/hello', function(x, y, callback){ callback(); }); 



app.post('/video', function(req, res){

    var content;

    videos.findOne({ videoPath: "D:\\H@rDR0cK\\Others\\Projects\\Web Technology Project\\public\\Courses videos\\holala.mp4.mp4" }, function (err, result){
        if (err) throw err;
        videopath = result.videoPath;
        content = {"Description": result.description};
        res.render(__dirname + '/views/video.ejs', content);
    });
});

app.get('/displayVideo', function(req, res){
    //var requestforvideo = req.body.video;   
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

// app.post('/registered', function(req, res){
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'hardiktrivedi974@gmail.com',
//       pass: '*******'
//     }
//   });
//   let mailOptions = {
//     from: '"Hardik Trivedi" <hardiktrivedi974@gmail.com>',
//     to: req.body.email,
//     subject: "Welcome to Courses.com",
//     text: "Welcome fellow teacher. We are very glad to inform you that you have successfully registered as the teacher at Courses.com. Enjoy Teaching!"
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error){
//       return console.log(error);
//     }
//     else{
//       console.log("Email sent successfully");
//       console.log(mailOptions.to);
//     }
//   });
//   res.render("registered");
// })

module.exports = app;

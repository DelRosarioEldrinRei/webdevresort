var express = require('express');
var loginRouter = express.Router();
var signupRouter = express.Router();
var logoutRouter = express.Router();
var multer  = require('multer');
var router = express.Router();
var galleryRouter= express.Router();
const ejs = require('ejs');

var app = express()

var authMiddleware = require('./middlewares/auth');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/image')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
  })
var upload = multer({storage: storage});

loginRouter.route('/')
    .get(authMiddleware.noAuthed, (req, res) => {
        res.render('auth/views/login', req.query);
    })
    .post((req, res) => {
        var db = require('../../lib/database')();

        db.query(`SELECT * FROM tbl_accounts WHERE strEmail="${req.body.email}"`, (err, results, fields) => {
            if (err) throw err;
            if (results.length === 0) return res.redirect('/login?incorrect');

            var user = results[0];

            if (user.strPassword !== req.body.password) return res.redirect('/login?incorrect');

            delete user.password;

            req.session.user = user;

            return res.redirect('/');
        });
    });

logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/login');
    });
});

signupRouter.route('/')
.get((req, res) => {
  res.render("home/views/signup")
});

signupRouter.post('/',(req,res) =>{
    var db = require("../../lib/database")();
    var user = req.body;
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    var password = req.body.password;
    const queryString = `INSERT INTO tbl_accounts (strFirstName, strLastname, strPassword, strEmail) VALUES (?,?,?,?)`;
    db.query(queryString ,[first, last, password, email] , (err, results, fields) => {
        console.log("hello");   
        if(err) return console.log(err); 
        delete user.password;


        req.session.user = user;
        console.log(req.session.user)
        return res.redirect('/login');
    });
})

galleryRouter.post('/', upload.single('strImage'), (req, res) => {
    var db = require('../../lib/database')();
    console.log(req.file);


    if (typeof req.file !== 'undefined'){
        req.body.strImage = req.file.filename;
        console.log(req.file.filename)
    }
    const queryString = 'INSERT INTO tbl_gallery (strImage) VALUES (?)';    
    db.query(queryString,[req.body.strImage], function (err, results, field) {
         if (err) return res.send(err);
         req.session.user.strImage = req.body.strImage;
         res.redirect('/index');
    });

})


exports.login = loginRouter;
exports.signup = signupRouter;
exports.logout = logoutRouter;
exports.gallery = galleryRouter;
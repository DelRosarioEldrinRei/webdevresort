var express = require('express');
var router = express.Router();
var authMiddleware = require('../auth/middlewares/auth');
var multer  = require('multer');

router.use(authMiddleware.hasAuth);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
var upload = multer({storage: storage});

var indexController = require('./controllers/index');

router.route('/')
  .get((req, res) => {
    res.render("home/views/landing")
  });

router.route('/home')
  .get((req, res) => {
    res.render("home/views/index")
  });

router.route('/show')
  .get((req, res) => {
    res.render("home/views/show")
  });

router.route('/gallery')
  .get((req, res) => {
    var db = require('../../lib/database')();
    // const queryString = 'SELECT strImage FROM tbl_gallery ORDER BY DESC';
    db.query('SELECT strImage FROM tbl_gallery', function (err, results, fields) {
      if (err) return res.send(err);
      render(results);
  });
  function render(images) {
    res.render("home/views/gallery", {images:images});
  }
  })
  .post(upload.single('strImage'), (req, res) => {
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
         res.redirect('/home');
    });
  })

router.route('/reserve/private')
  .get((req, res) => {
    res.render("home/views/reserveprivate")
  })
  .post((req, res) => {
    res.redirect("/home")
    var db = require('../../lib/database')();
    var user = req.body;
    var date = req.body.datDate;
    console.log(req.file);
    console.log(date)
    const queryString = `INSERT INTO tbl_reserve (intReserveAccountID, datDate) VALUES (?,?)`
    db.query(queryString ,[req.session.user.intAccountsID, date ] , (err, results, fields) => {
      console.log("hello");   
      if(err) return console.log(err); 
      delete user.password;

      req.session.user = user;
      console.log(req.session.user)
      return res.redirect('/login');
  });    
  })

router.route('/reserve/public')
  .get((req, res) => {
    res.render("home/views/reservepublic")
  })
  .post((req, res) => {
    res.redirect("/home")    
  })

/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;
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
    db.query(queryString ,[req.session.user.intAccountsID, date] , (err, results, fields) => {
      console.log("hello");   
      if(err) return console.log(err); 
      delete user.password;
      req.session.user = user;
      console.log(req.session.user)
  });    
  })

router.route('/reserve/public')
  .get((req, res) => {
    res.render("home/views/reservepublic")
  })
  .post((req, res) => {
    res.redirect("/home")
    var db = require('../../lib/database')();
    var user = req.body;
    var date = req.body.datDate;
    var time = req.body.optionday;
    // var time2 = req.body.optiontime2;
    var adult = req.body.adult;
    var booadult = 1;
    var boochild = 2;
    var boobasic = 1;
    var boomedium = 2;
    var boopremium = 3;
    var child = req.body.child;
    var basic = req.body.basic;
    var medium = req.body.meduim;
    var premium = req.body.premuim;
    var rbasic = req.body.basic;
    var rmedium = req.body.meduim;
    var rpremium = req.body.premuim;
    console.log(req.file);
    console.log(date);
    console.log(time);
    const queryString = `INSERT INTO tbl_reserve (intReserveAccountID, datDate, booTime) VALUES (?,?,?)`
    db.query(queryString ,[req.session.user.intAccountsID, date, time] , (err, results, fields) => {
      console.log("hello");   
      if(err) return console.log(err);
    
    if(adult > 0){
      const queryString = `INSERT INTO tbl_reserve_ticket (intRTReserveID, intTicketID, intQTY ) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, booadult, adult] , (err, results, fields) => {
      console.log("Ticket");   
      if(err) return console.log(err);
      })
    }
    if(child > 0){
      const queryString = `INSERT INTO tbl_reserve_ticket (intRTReserveID, intTicketID, intQTY ) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boochild, child] , (err, results, fields) => {
      console.log("Ticket");   
      if(err) return console.log(err);
      })
    }
    if(basic > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boobasic, rbasic] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
    if(medium > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boomedium, rmedium] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
    if(premium > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boopremium, rpremium] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
    
    if(rbasic > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boobasic, rbasic] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
    if(rmedium > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boomedium, rmedium] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
    if(rpremium > 0){
      const queryString = `INSERT INTO tbl_reserve_Cottage (intRSReserve, intRoomID, intQTY) VALUES (?,?,?)`
      db.query(queryString ,[req.session.user.intReserveID, boopremiumr, premium] , (err, results, fields) => {
      console.log("cottage");   
      if(err) return console.log(err);
      })
    }
      delete user.password;
      req.session.user = user;
      console.log(req.session.user)
  });    
  })

/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;
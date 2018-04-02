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

router.get('/', indexController);

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
         res.redirect('/index');
    });
  })

router.route('/reserve')
  .get((req, res) => {
    res.render("home/views/reserve")
  })
  .post((req, res) => {
    res.redirect("/index")    
  })


/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); // res.render('index'...) renders the ./views/index.ejs template
});

module.exports = router;

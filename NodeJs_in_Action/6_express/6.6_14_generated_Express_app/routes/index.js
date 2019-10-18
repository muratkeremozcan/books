var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); // res.render('index'...) renders the ./views/index.ejs template
});
// IMPORTANT: Express provides 2 ways to render views:
// * app.render() at application level
// * res.render() at response
module.exports = router;

const express = require('express');
const router = express.Router();

/* GET homepage redirect to splash */
router.get('/', function(req, res) {
  res.redirect('/splash');
});

/* GET splash page */
router.get('/splash', function(req, res) {
  res.sendFile('splash.html', {root: './public'});
});

/* GET game page */
router.get('/game', function(req, res) {
  res.sendFile('game.html', {root: './public'});
});

module.exports = router;
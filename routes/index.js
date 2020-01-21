const express = require('express');
const router = express.Router();

// Local
const st = require('../statustracker.js');

/* GET homepage redirect to splash */
router.get('/', function(req, res) {
  res.redirect('/splash');
});

/* GET splash page */
router.get('/splash', renderSplash);

/* GET game page */
router.get('/game', function(req, res) {
  res.sendFile('game.html', {root: './public'});
});

function renderSplash(req, res) {
  res.render('splash.ejs', {
    started: st.gamesStarted,
    finished: st.gamesFinished,
    abandoned: st.gamesAbandoned
  });
}

/*
 * @deprecated Replaced by an embedded jaavascript render
 */
function sendSplash(req, res) {
  res.sendFile('splash.html', {root: './public'});
}

module.exports = router;
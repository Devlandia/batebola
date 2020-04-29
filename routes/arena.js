const express = require('express');
const router  = express.Router();
const path    = require('path');

router.post('/', function(req, res, next){
  var arenaId = new Date().getTime();

  res.render('arena', { arenaId: arenaId, username: req.body.username })
});

router.post('/join', function(req, res, next) {
  res.render('arena', { arenaId: req.body.arenaId, username: req.body.username })
});

module.exports = router;

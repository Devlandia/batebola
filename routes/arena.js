const express = require('express');
const router  = express.Router();
const path    = require('path');

router.get('/:id', function(req, res, next) {
  res.render('arena', { arenaId: req.params.id })
});

module.exports = router;

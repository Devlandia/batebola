const express = require('express');
const router  = express.Router();
const path    = require('path');

function viewPath(file){
  return path.join(`${__dirname}/../app/views/${file}.html`)
}

router.get('/:id', function(req, res, next) {
  res.sendFile(viewPath('index'))
});

module.exports = router;

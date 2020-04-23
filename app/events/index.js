const express   = require('express');
const http      = require('http');

const path      = require('path');
const fs        = require('fs');
const basename  = path.basename(__filename);

const app     = express();
const server  = http.createServer(app);
const io      = require('socket.io')(server)

const events  = {};

io.on('connection', (socket) => {
  console.log('a user connected')

  fs.readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      fullPath = path.join(__dirname, file)
      myEvent = require(fullPath)
      myEvent(socket)
      //console.log(myEvent('foo', 'bar'))
    });


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})


module.exports = app;
module.exports.server = server;

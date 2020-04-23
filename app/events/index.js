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

  // Read all files from same dir except index
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      // Require files as socket listeners
      require(path.join(__dirname, file))(io, socket)
    });


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})


module.exports = app;
module.exports.server = server;

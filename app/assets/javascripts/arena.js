$(document).ready(function(){
  var socket = io();

  socket.emit('foo');

  socket.on('bar', function(param){
    console.log('\n\n');
    console.log('####################################################');
    console.log('bar with '+ param)
    console.log('####################################################');
    console.log('\n\n');


  });
});

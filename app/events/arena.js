module.exports = (socket) => {
  socket.on('foo', () => {
    console.log('\n\n');
    console.log('####################################################');
    console.log('foo')
    console.log('####################################################');
    console.log('\n\n');

    socket.emit('bar', 'param 1')
  })
}

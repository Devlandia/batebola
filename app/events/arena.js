const models  = require('../models')
const Player  = models['Player']

module.exports = (io, socket) => {
  socket.on('init game', (userId) => {
    console.log(`Game started as ${userId}`)

    const players = []
    const positions = [
      'goleiro', 'zagueiro', 'zagueiro', 'zagueiro', 'zagueiro', 'volante', 'volante',
      'volante', 'atacante', 'atacante', 'atacante' ]

    for(var i = 0; i < 11; i++){
      players.push(Player.build({
        name      : `Jogador ${i + 1}`,
        position  : positions[i]
      }))
    }

    io.emit('refresh deck', userId, JSON.stringify(players))
  })
}

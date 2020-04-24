const models  = require('../models')
const Player  = models['Player']

// create a hash with players.
/// fill with userIds and return everything when keys.length == 2
const players = {}

module.exports = (io, socket) => {
  socket.on('init game', (userId) => {
    console.log(`Game started as ${userId}`)

    if(!(userId in players)){
      const positions = [ 'goleiro', 'zagueiro', 'zagueiro', 'zagueiro', 'zagueiro',
        'volante', 'volante', 'volante', 'atacante', 'atacante', 'atacante' ]

      players[userId] = {
        players: []
      }

      for(var i = 0; i < 11; i++){
        players[userId].players.push(Player.build({
          name      : `Jogador ${i + 1}`,
          position  : positions[i]
        }))

        // TODO: Just for tests
        i += 2
      }
    }

    io.emit('refresh deck', JSON.stringify(players))
  })
}

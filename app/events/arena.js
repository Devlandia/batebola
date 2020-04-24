const models  = require('../models')
const Player  = models['Player']

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

// create a hash with players.
/// fill with userIds and return everything when keys.length == 2
const players = {}

module.exports = (io, socket) => {
  socket.on('init game', (userId) => {

    console.log(`Game started as ${userId}`)

    const positions = [ 'Goleiro', 'Zagueiro', 'Zagueiro', 'Zagueiro', 'Zagueiro',
      'Volante', 'Volante', 'Volante', 'Atacante', 'Atacante', 'Atacante' ]

    players[userId] = {
      team: []
    }

    for(var i = 0; i < 11; i++){
      players[userId].team.push(Player.build({
        name      : `Jogador ${i + 1}`,
        position  : positions[i],
        ownBall   : false,
        movements : []
      }))

      // TODO: Just for tests
      i += 2
    }

    keys = Object.keys(players)
    if(keys.length == 2){
      firstPlayer = keys.sample()
      team        = players[firstPlayer].teams

      console.log(team)
    }

    io.emit('refresh deck', JSON.stringify(players))
  })
}

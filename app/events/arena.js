const models  = require('../models')
const Player  = models['Player']

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

const players = {}

module.exports = (io, socket) => {
  /**
   * Creates an array of players to informed userId
   * When players has 2 entries, get a random player and gives tha ball to first defender of team.
   */
  socket.on('init game', (userId) => {

    console.log(`Game started as ${userId}`)

    const positions = [ 'Goleiro', 'Zagueiro', 'Zagueiro', 'Zagueiro', 'Zagueiro',
      'Volante', 'Volante', 'Volante', 'Atacante', 'Atacante', 'Atacante' ]

    // Initialize player team
    players[userId] = {
      team: []
    }
    let currentPlayer

    // build the team for informed userId
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

    // Clear ownBall of all players and set it again.
    for (var [key, value] of Object.entries(players)) {
      for(var [k, v] of Object.entries(value.team)){
        v.ownBall = false
      }
    }
    keys = Object.keys(players)
    if(keys.length == 2){
      currentPlayer = keys.sample()

      players[currentPlayer].team[1].ownBall = true
    }

    io.emit('refresh deck', currentPlayer, JSON.stringify(players))
  })
}

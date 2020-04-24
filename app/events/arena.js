const models  = require('../models')
const Player  = models['Player']

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

const players = {}

function buildTeam(userId){
  const positions = [ 'Goleiro', 'Zagueiro', 'Zagueiro', 'Zagueiro', 'Zagueiro',
    'Volante', 'Volante', 'Volante', 'Atacante', 'Atacante', 'Atacante' ]

  // Initialize player team
  players[userId] = {
    team      : [],
    movements : []
  }

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
}

/**
 * Set ownBall of all players from all teams as false.
 */
function clearOwnBall(){
  for (var [key, value] of Object.entries(players)) {
    for(var [k, v] of Object.entries(value.team)){
      v.ownBall = false
    }
  }
}

/**
 * Gives the ball to a team.
 * Clear all player movements.
 */
function ownBall(userId){
  players[userId].team[1].ownBall = true

  for (var [player, values] of Object.entries(players)) {
    player.movements = []
  }
}

module.exports = (io, socket) => {
  /**
   * Creates an array of players to informed userId
   * When players has 2 entries, get a random player and gives tha ball to first defender of team.
   */
  socket.on('init game', (userId) => {
    console.log(`Game started as ${userId}`)

    let currentPlayer

    buildTeam(userId) // creates the team for each user
    clearOwnBall()    // set all players as non owner

    // pick one player to start the match.
    keys = Object.keys(players)
    if(keys.length == 2){
      currentPlayer = keys.sample()

      ownBall(currentPlayer)
    }

    io.emit('refresh deck', userId, JSON.stringify(players))
  })

  socket.on('movement', function(){
  })
}

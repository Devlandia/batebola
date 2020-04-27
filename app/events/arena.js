const models  = require('../models')
const Player  = models['Player']

Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

const players = {}
const score   = {}

function buildTeam(userId){
  const positions = [ 'Goleiro', 'Zagueiro', 'Zagueiro', 'Zagueiro', 'Zagueiro',
    'Volante', 'Volante', 'Volante', 'Atacante', 'Atacante', 'Atacante' ]

  // Initialize player team
  players[userId] = {
    team      : [],
    movements : []
  }
  score[userId] = 0

  // build the team for informed userId
  for(var i = 0; i < 11; i++){
    // TODO: Use player model instad of this object
    players[userId].team.push({
      name      : `Jogador ${i + 1}`,
      position  : positions[i],
      ownBall   : false,
    })

    // TODO: Just for tests
    i += 2
  }
}

/**
 * Get a randomic number between 1 ~ 10
 */
function rollDice(){
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sample()
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
  players[userId].team[0].ownBall = true

  for (var [player, values] of Object.entries(players)) {
    player.movements = []
  }
}

/**
 * Returns the index of ball owner on teams array.
 */
function ballOwner(){
  for (var [key, value] of Object.entries(players)) {
    for(var [k, v] of Object.entries(value.team)){
      if(v.ownBall){
        return k
      }
    }
  }
}

function passBallToNext(userId){
  current = ballOwner()
  next    = parseInt(current) + 1

  players[userId].team[current].ownBall = false
  players[userId].team[next].ownBall    = true
}

/**
 * Returns the id of opponent.
 */
function opponentId(userId){
}

/**
 * Gives the ball to opponent.
 * Clear all movements.
 */
function loseBall(userId){
  opponentId = Object.keys(players).filter((item) => {
    return item != userId;
  })[0]

  clearOwnBall()
  ownBall(opponentId)

  for (var [player, values] of Object.entries(players)) {
    player.movements = []
  }
}

function allowPlay(userId){
  owner = ballOwner()

  return owner < 3;
}

function allowKick(userId){
  owner = ballOwner()

  return owner > 2;
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
      io.emit('message', 'Match started')
      io.emit('refresh score', JSON.stringify(score))
    }

    io.emit('refresh deck', userId, true, false, JSON.stringify(players))
  })

  socket.on('play', (userId) => {
    let message;

    if(rollDice() > 5){
      passBallToNext(userId)
      players[userId].movements.push('Pass')

      io.emit('message', 'Player has successufl passed the ball')
    }
    else{
      loseBall(userId)
      opponentId = Object.keys(players).filter((item) => {
        return item != userId;
      })[0]
      userId = opponentId

      io.emit('message', 'Player failed to pass the ball')
    }

    io.emit('refresh deck', userId, allowPlay(userId), allowKick(userId), JSON.stringify(players))
  })

  socket.on('kick', (userId) => {
    if(rollDice() > 6){
      io.emit('message', 'Gol!');

      score[userId] += 1
      io.emit('refresh score', JSON.stringify(score))
    }
    else{
      io.emit('message', 'Chutou para fora!');
    }

    loseBall(userId)
    userId = opponentId

    io.emit('refresh deck', userId, true, false, JSON.stringify(players))
  })
}

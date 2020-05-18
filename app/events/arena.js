const Arena   = require('./arena/arena')
const arenas  = {}

module.exports = (io, socket) => {
  /**
   * Join to arena, if it is available to receive a new player;
   * Emit signal with serialized teams.
   */
  socket.on('join game', (arenaId, userId, userName) => {
    console.log(`Joined to arena ${arenaId} as ${userId}`)

    // Create arena if it does not exist
    let arena;
    if(!arenas[arenaId]){
      arenas[arenaId] = new Arena(arenaId)
    }
    arena = arenas[arenaId]

    // try to add a player
    try{
      arena.addPlayer(userId, userName)
    }
    catch(err){
      console.log(err.message);
      io.emit('fatal error', err);
    }

    msg = (arena.isReadyToStart()) ? "Ready, let's play" : "Waiting for an opponent"
    io.emit('message', arena.id, msg)

    io.emit('refresh deck', arena.serialize())
  })

  socket.on('play', (arenaId, userId) => {
    var arena   = arenas[arenaId]
    var player  = arena.players[userId]
    var result  = player.passBallToNext()

    if(!result){
      arena.swapBallOwner()
    }

    io.emit('refresh deck', arena.serialize())
  })

  socket.on('kick', (arenaId, userId) => {
    var arena   = arenas[arenaId]
    var player  = arena.players[userId]
    var result  = player.kick()

    if(result){
      arena.computeGoal(userId)
      io.emit('message', arena.id, 'Gol!')
    }
    else{
      io.emit('message', arena.id, 'Chutou pra fora!')
    }

    arena.swapBallOwner()

    io.emit('refresh deck', arena.serialize())

  })
}

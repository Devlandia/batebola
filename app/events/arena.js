/**
 * Roll 1 d10
 */
function rollDice(){
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sample()
}

/**
 * Gives a random element from an array
 */
Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

class Player {
  constructor(id, name) {
    this.id         = id;
    this.name       = name;
    this.team       = [];
    this.movements  = [];
    this.ownBall    = false;
    this.allowPass  = false;
    this.allowKick  = false;

    this._initializeTeam();
  }

  /**
   * Try to pass the ball to the next player, rolling 1d10.
   * If success, set player with ownBall property to next index on array.
   *
   * @return true if success, false if failure.
   */
  passBallToNext(){
    // TODO: Just for tests
    if(rollDice() < 3){
      return false;
    }
    else {
      var current = this._ballOwnerIndex()
      var next    = current + 1

      this.team[current].ownBall  = false
      this.team[next].ownBall     = true

      if(next == this.team.length - 1){
        this.allowPass  = false;
        this.allowKick  = true;
      }

      return true;
    }
  }

  kick(){
    // TODO: Just for tests
    return (rollDice() > 3)
  }

  loseBall(){
    this.ownBall    = false;
    this.allowPass  = false;
    this.allowKick  = false;

    for(var [idx, player] of Object.entries(this.team)){
      player.ownBall = false
    }
  }

  wonBall(){
    this.movements = []

    this.ownBall    = true;
    this.allowPass  = true;
    this.team[0].ownBall = true;
  }

  /**
   * Generate random players to user team.
   */
  _initializeTeam(){
    const positions = [ 'Goleiro', 'Zagueiro', 'Zagueiro', 'Zagueiro', 'Zagueiro',
      'Volante', 'Volante', 'Volante', 'Atacante', 'Atacante', 'Atacante' ]

     for(var i = 0; i < 11; i++){
       this.team.push({
         name      : `Player ${i + 1}`,
         position  : positions[i],
         ownBall   : false,
       })

       // TODO: Just for tests
       i += 2
     }
  }

  /**
   * Gives the index of players array with ownBall = true.
   *
   * @return int
   */
  _ballOwnerIndex(){
    for(var [idx, player] of Object.entries(this.team)){
      if(player.ownBall){
        return parseInt(idx);
      }
    }
  }

}

class Arena {
  constructor(id) {
    this.id       = id;
    this.started  = false;
    this.finished = false;
    this.winner   = null;
    this.score    = {};
    this.players  = {};
  }

  isReadyToStart(){
    var keys = Object.keys(this.players)

    return keys.length == 2;
  }

  addPlayer(userId, name){
    if(this._allowNewMembers()){
      this.players[userId]  = new Player(userId, name)
      this.score[userId]    = 0

      if(this._firstPlayer() == userId){
        this.players[userId].wonBall()
      }

      if(this.isReadyToStart()){
        this.started = true;
      }
    }
    else{
      throw 'This arena already has 2 players'
    }
  }

  swapBallOwner(){
    for(var [idx, player] of Object.entries(this.players)){
      if(player.ownBall){
        player.ownBall = false
        player.loseBall()
      }
      else{
        player.ownBall = true
        player.wonBall()
      }
    }
  }

  computeGoal(userId){
    this.score[userId] += 1

    if(this.score[userId] > 2){
      this.finished = true;
      this.winner = userId;
    }
  }

  serialize(){
    return JSON.stringify(this);
  }

  _allowNewMembers(){
    var keys = Object.keys(this.players)

    return keys.length < 2;
  }

  _firstPlayer(){
    return Object.keys(this.players)[0];
  }
}

const arenas = {}

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

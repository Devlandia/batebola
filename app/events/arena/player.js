/**
 * Gives a random element from an array
 */
Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

/**
 * This class handles each player of the game, with its name, id and team.
 */
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
    if(this._rollDice() < 3){
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
    return (this._rollDice() > 3)
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
   * Roll 1 d10
   */
  _rollDice(){
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sample()
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

module.exports = Player

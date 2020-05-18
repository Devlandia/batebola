const Player = require('./player')

/**
 * This class handles the arena where both players logs in order to play.
 */
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

module.exports = Arena

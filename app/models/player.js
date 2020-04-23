'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player',
    {
      name      : DataTypes.STRING,
      position  : DataTypes.STRING,
        ownBall: {
          type: DataTypes.VIRTUAL,
          set: function(value) {
            this.setDataValue('ownBall', value);
          },
          get: function() {
            return this.getDataValue('ownBall');
          },
        },
        movements: {
          type: DataTypes.VIRTUAL,
          set: function(value) {
            this.setDataValue('movements', value);
          },
          get: function() {
            return this.getDataValue('movements');
          },
        }
    },
    {
      tableName: 'players',
      hooks: {
      }
    }
  );

  Player.prototype.checkSuccess = () => {
    return Math.floor(Math.random() * 10) > 6;
  }

  return Player;
};

'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
      {
        email: {
          type: DataTypes.STRING,
          validate: {isEmail: true},
          unique: true,
        },
        password: {
          type: DataTypes.VIRTUAL,
          set: function(value) {
            this.setDataValue('password', value);
          },
          get: function() {
            return this.getDataValue('password');
          },
        },
        salt: DataTypes.STRING,
        salted_password: DataTypes.STRING,
        token: DataTypes.STRING,
      },
      {
        tableName: 'users',
        hooks: {
          beforeCreate: (user) => {
            user.salt = bcrypt.genSaltSync();
            user.salted_password = User.generateHash(user.salt, user.password);
          },
        },
      },
  );

  User.generateHash = function(salt, rawString) {
    return bcrypt.hashSync(rawString, salt);
  };

  User.prototype.checkPassword = function(str) {
    const encryptedPassword = User.generateHash(this.salt, str);

    return encryptedPassword == this.salted_password;
  };

  User.prototype.generateToken = function() {
    const now = new Date().getTime();
    const token = crypto.createHash('md5')
        .update(this.email + now)
        .digest('hex');

    this.update({token: token});

    return token;
  };

  return User;
};

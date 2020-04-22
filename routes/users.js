const express = require('express');
const router = express.Router();
const models = require('../app/models');
const User = models['User'];
const Sequelize = require('sequelize');

/* GET users */
router.get('/', function(req, res, next) {
  User.findAll().then(function(users) {
    res.json(users);
  });
});

/* Create a new user */
router.post('/', function(req, res, next) {
  User.create({
    email: req.body.email,
    password: req.body.password,
  }).then(function(user) {
    res.json(user);
  }).catch(Sequelize.ValidationError, function(err) {
    const msgs = err.errors.map(function(item) {
      return item.message;
    });

    res.json({errors: msgs});
  });
});

/* Get an user by id */
router.get('/:id', function(req, res, next) {
  User.findOne({where: {id: req.params.id}}).then(function(user) {
    res.json(user);
  }) .catch(function(err) {
    console.log(err);

    res.json('error');
  });
});

/* Update an user */
router.put('/:id', function(req, res, next) {
  User.findOne({where: {id: req.params.id}}).then(function(user) {
    if (user == null) {
      res.json({error: 'not found'});
      return;
    }
    user.email = req.body.email;
    user.save()
        .then(function(u) {
          res.json(u);
        })
        .catch(function(err) {
          const msgs = err.errors.map(function(item) {
            return item.message;
          });

          res.json({errors: msgs});
        });
  }) .catch(function(err) {
    console.log(err);

    res.json('error');
  });
});

/* Delete an user */
router.delete('/:id', function(req, res, next) {
  User.findOne({where: {id: req.params.id}}).then(function(user) {
    if (user == null) {
      res.json({error: 'not found'});
      return;
    }
    user.destroy().then(function(u) {
      res.json(user);
    }).catch(function(err) {
      console.log(err);

      res.json('error');
    });
  });
});

/* Authenticate user by username / password */
router.post('/authenticate', function(req, res, next) {
  User.findOne({where: {email: req.body.email}})
      .then(function(user) {
        if (user == null) {
          return res.json({error: 'Invalid username'});
        }
        if (!user.checkPassword(req.body.password)) {
          return res.json({error: 'Invalid password'});
        }

        res.json({email: req.body.email, token: user.generateToken()});
      })
      .catch(function(err) {
        console.log(err);
        res.json({error: err.message});
      });
});

module.exports = router;

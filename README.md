# Running

## Getting it up and running

Assuming you have Docker and Docker Compose, run

```
$ cp .env-sample .env
$ docker-compose up
```

# Developing

start nodemon service
```
$ npm run dev
```

code standards
```
$ npx eslint . --fix
```

running tests
```
$ npm test
```

# Database connection

Database connection is turned out. In order to turn it on, edit `bin/www` and uncomment line 15:
```
//models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
//});
```

# References

* [Express with PostrgeSQL](https://expressjs.com/en/guide/database-integration.html#postgresql)
* [Express with sequelize](https://sequelize.readthedocs.io/en/rtd/articles/express/)
* [Express Migrations](https://sequelize.readthedocs.io/en/rtd/docs/migrations/)
* [Tests](https://medium.com/@hdeodato/teste-autom%C3%A1tico-de-api-rest-usando-com-node-js-mocha-chai-6aec4613d100)
* [Useful Tools](https://medium.com/london-nodejs/useful-tools-for-your-node-js-projects-20fd1f7c860a)
* [Socket.io](https://socket.io/)

## For Tests
* [Mocha](https://mochajs.org/) is a test framework.
* [Chai](https://www.chaijs.com/) is an assertion library.
* [ESLint](https://eslint.org/) is a static code analyzer.
* [Factory Girl](https://github.com/simonexmachina/factory-girl) is a library to seed data to db.
* [Faker](https://github.com/Marak/Faker.js#readme) is a lib to generate fake data.
* [Database Cleaner](https://github.com/emerleite/node-database-cleaner) cleans database when run tests.

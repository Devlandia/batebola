# Running

## Getting it up and running

Assuming you have Docker and Docker Compose, run

```
$ cp .env-sample .env
$ docker-compose up
```

## cURL requests

Create a new user
```
$ curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' -d '{"email":"rodrigovdb@gmail.com","password":"rapadura"}' -X POST http://localhost:3000/users
```

Get users
```
$ curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET http://localhost:3000/users
```

Get an user by id
```
$ curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET http://localhost:3000/users/1
```

Update an user
```
$ curl -H 'Accept: application/json' -H 'Content-Type: application/json' -d '{"email":"rodrigo@rockalenha.com.br"}' -X PUT http://localhost:3000/users/1
```

Delete an user
```
$ curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' -X DELETE http://localhost:3000/users/1
```

Authenticate an user
```
$ curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' -d '{"email":"rodrigovdb@gmail.com","password":"rapadura"}' -X POST http://localhost:3000/users/authenticate
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

# References

* [Express with PostrgeSQL](https://expressjs.com/en/guide/database-integration.html#postgresql)
* [Express with sequelize](https://sequelize.readthedocs.io/en/rtd/articles/express/)
* [Express Migrations](https://sequelize.readthedocs.io/en/rtd/docs/migrations/)
* [Tests](https://medium.com/@hdeodato/teste-autom%C3%A1tico-de-api-rest-usando-com-node-js-mocha-chai-6aec4613d100)
* [Useful Tools](https://medium.com/london-nodejs/useful-tools-for-your-node-js-projects-20fd1f7c860a)

## For Tests
* [Mocha](https://mochajs.org/) is a test framework.
* [Chai](https://www.chaijs.com/) is an assertion library.
* [ESLint](https://eslint.org/) is a static code analyzer.
* [Factory Girl](https://github.com/simonexmachina/factory-girl) is a library to seed data to db.
* [Faker](https://github.com/Marak/Faker.js#readme) is a lib to generate fake data.
* [Database Cleaner](https://github.com/emerleite/node-database-cleaner) cleans database when run tests.

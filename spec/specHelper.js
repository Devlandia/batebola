
// Force env to test
process.env.NODE_ENV = 'test'

// Factory
const factory = require('factory-girl').factory
const faker   = require('faker')
const models  = require('../app/models')

// Makes http requests and does not need app started
const chaiHttp = require('chai-http');
const chai = require('chai');
chai.use(chaiHttp);

// Expectations
//const expect = chai.expect;

// Clear whole database before start
before((done) => {
  models.sequelize.sync({ force: true }).then(() => {
    done()
  })
})

/** Factories **/
factory.define('user', models['User'], {
  email     : faker.internet.email,
  password  : 'rapadura'
});

exports.request = chai.request;
exports.expect  = chai.expect;
exports.factory = factory;

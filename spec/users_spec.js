const helpers = require('./specHelper')

// App
const app = require('../app');

const request = helpers.request
const expect  = helpers.expect

describe('Users API', () => {
  describe('GET', () => {
    it('should return all users', (done) => {
      helpers.factory.createMany('user', 10).then((users) => {
        var ids = users.map((item) => { return item.id })

        request(app)
          .get('/users')
          .end((err, res) => {
            var response_ids = res.body.map((item) => { return item.id })

            expect(err).to.be.null
            expect(res.statusCode).to.equal(200)
            expect(res.body.length).to.equal(10)
            expect(response_ids).to.have.members(ids)
          })
      })

      done()
    });
  })
});

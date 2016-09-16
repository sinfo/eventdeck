var Lab = require('lab')
var Code = require('code')

var server = require('../').hapi

var lab = exports.lab = Lab.script()

var credentials = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'development-team',
    event: '1000-sinfo'
  }]
}

lab.experiment('Authorization', function () {
  lab.test('Check Authorization', function (done) {
    server.methods.authorization.isAdmin(credentials, function (err, response) {
      Code.expect(err, 'err').to.be.null

      done()
    })
  })
})

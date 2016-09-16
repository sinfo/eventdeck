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

var eventA = {
  name: 'Super Festinha de anos do Chico'
}

var eventAId

var changesToA = {
  name: 'Super Grande Festarrona de Anos do Chico'
}

lab.experiment('Event', function () {
  lab.test('Create', function (done) {
    var options = {
      method: 'POST',
      url: '/api/events',
      credentials: credentials,
      payload: eventA
    }

    server.inject(options, function (response) {
      var result = response.result
      eventAId = result.id.toString()
      Code.expect(response.statusCode).to.equal(201)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.name).to.equal(eventA.name)

      done()
    })
  })

  lab.test('List all', function (done) {
    var options = {
      method: 'GET',
      url: '/api/events',
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Array)
      Code.expect(result[0].name).to.be.string
      done()
    })
  })

  lab.test('Get one', function (done) {
    var options = {
      method: 'GET',
      url: '/api/events/' + eventAId,
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.name).to.equal(eventA.name)

      done()
    })
  })

  lab.test('Update', function (done) {
    var options = {
      method: 'PUT',
      url: '/api/events/' + eventAId,
      credentials: credentials,
      payload: changesToA
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.name).to.equal(changesToA.name)

      done()
    })
  })

  lab.test('Delete', function (done) {
    var options = {
      method: 'DELETE',
      url: '/api/events/' + eventAId,
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.name).to.equal(changesToA.name)
      done()
    })
  })
})

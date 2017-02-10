const Lab = require('lab')
const Code = require('code')
const expect = Code.expect

const server = require('../').hapi

const lab = exports.lab = Lab.script()

const memberA = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'development-team',
    event: '23-sinfo'
  }]
}

const changesMemberA = {
  name: 'Jane Doe'
}

const credentials = memberA

lab.experiment('Members', () => {
  lab.test('Create', (done) => {
    server.methods.member.create(memberA, (err, result) => {
      expect(err).to.be.null()
      expect(result).to.be.instanceof(Object)
      expect(result.id).to.equal(memberA.id)
      expect(result.name).to.equal(memberA.name)

      done()
    })
  })

  lab.test('List all', function (done) {
    var options = {
      method: 'GET',
      url: '/api/members',
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Array)
      Code.expect(result[0].id).to.be.string
      Code.expect(result[0].name).to.be.string
      Code.expect(result[0].participations).to.be.instanceof(Array)

      done()
    })
  })

  lab.test('Get me', (done) => {
    let options = {
      method: 'GET',
      url: '/api/members/me',
      credentials: credentials
    }

    server.inject(options, function (response) {
      let result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.be.instanceof(Object)
      expect(result.id).to.equal(credentials.id)
      expect(result.name).to.equal(credentials.name)

      done()
    })
  })

  lab.test('Get one', (done) => {
    let options = {
      method: 'GET',
      url: '/api/members/' + memberA.id,
      credentials: credentials
    }

    server.inject(options, function (response) {
      let result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.be.instanceof(Object)
      expect(result.id).to.equal(memberA.id)
      expect(result.name).to.equal(memberA.name)

      done()
    })
  })

  lab.test('Update', (done) => {
    const options = {
      method: 'PUT',
      url: '/api/members/' + memberA.id,
      credentials: credentials,
      payload: changesMemberA
    }

    server.inject(options, function (response) {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.be.instanceof(Object)
      expect(result.id).to.equal(memberA.id)
      expect(result.name).to.equal(changesMemberA.name)

      done()
    })
  })

  lab.test('Delete', (done) => {
    const options = {
      method: 'DELETE',
      url: '/api/members/' + memberA.id,
      credentials: credentials
    }

    server.inject(options, function (response) {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.be.instanceof(Object)
      expect(result.id).to.equal(memberA.id)
      expect(result.name).to.equal(changesMemberA.name)

      done()
    })
  })
})

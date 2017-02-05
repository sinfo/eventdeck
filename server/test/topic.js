const Lab = require('lab')
const Code = require('code')

const server = require('../').hapi

const lab = exports.lab = Lab.script()

const credentials = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'development-team',
    event: '1000-sinfo'
  }]
}

const topicA = {
  text: 'hey',
  kind: 'idea'
}

let topicAid

const changesTopicA = {
  text: 'Howdy'
}

lab.experiment('Topic', function () {
  lab.test('Create', function (done) {
    const options = {
      method: 'POST',
      url: '/api/topics',
      credentials: credentials,
      payload: topicA
    }

    server.inject(options, function (response) {
      const result = response.result

      Code.expect(response.statusCode).to.equal(201)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.text).to.equal(topicA.text)
      Code.expect(result.author).to.equal(credentials.id)

      topicAid = result.id.toString()

      done()
    })
  })

  lab.test('List all', function (done) {
    const options = {
      method: 'GET',
      url: '/api/topics',
      credentials: credentials
    }

    server.inject(options, function (response) {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Array)
      Code.expect(result[0].id).to.be.string
      Code.expect(result[0].author).to.be.string
      Code.expect(result[0].text).to.be.string
      done()
    })
  })

  lab.test('Get one', function (done) {
    const options = {
      method: 'GET',
      url: '/api/topics/' + topicAid,
      credentials: credentials
    }

    server.inject(options, function (response) {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.author).to.equal(credentials.id)
      Code.expect(result.text).to.equal(topicA.text)
      Code.expect(result.id.toString()).to.equal(topicAid)

      done()
    })
  })

  lab.test('Update', function (done) {
    const options = {
      method: 'PUT',
      url: '/api/topics/' + topicAid,
      credentials: credentials,
      payload: changesTopicA
    }

    server.inject(options, function (response) {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.text).to.equal(changesTopicA.text)
      Code.expect(result.author).to.equal(credentials.id)
      Code.expect(result.id.toString()).to.equal(topicAid)
      done()
    })
  })

  lab.test('Delete', function (done) {
    const options = {
      method: 'DELETE',
      url: '/api/topics/' + topicAid,
      credentials: credentials
    }

    server.inject(options, function (response) {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.id.toString()).to.equal(topicAid)
      Code.expect(result.author).to.equal(credentials.id)
      Code.expect(result.text).to.equal(changesTopicA.text)

      done()
    })
  })
})

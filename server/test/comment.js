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

const commentA = {
  thread: 'company-example',
  subthread: 'company-example-subexample',
  text: 'this is an example of a comment'
}

const changesToA = {
  text: 'This is an example of an example of another example.'
}
let commId

lab.experiment('Comment', () => {
  lab.test('Create', (done) => {
    const options = {
      method: 'POST',
      url: '/api/comments',
      credentials: credentials,
      payload: commentA
    }

    server.inject(options, (response) => {
      const result = response.result

      Code.expect(response.statusCode).to.equal(201)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.thread, 'thread').to.equal(commentA.thread)
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread)
      Code.expect(result.text, 'text').to.equal(commentA.text)

      commId = result.id.toString()

      done()
    })
  })

  lab.test('List all', (done) => {
    const options = {
      method: 'GET',
      url: '/api/comments',
      credentials: credentials
    }

    server.inject(options, (response) => {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Array)
      Code.expect(result[0].thread, 'thread').to.be.string
      Code.expect(result[0].subthread, 'subthread').to.be.string
      Code.expect(result[0].text, 'text').to.be.string
      done()
    })
  })

  lab.test('Get one', (done) => {
    const options = {
      method: 'GET',
      url: '/api/comments/' + commId,
      credentials: credentials
    }

    server.inject(options, (response) => {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.thread, 'thread').to.equal(commentA.thread)
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread)
      Code.expect(result.text, 'text').to.equal(commentA.text)

      done()
    })
  })

  lab.test('Update', (done) => {
    const options = {
      method: 'PUT',
      url: '/api/comments/' + commId,
      credentials: credentials,
      payload: changesToA
    }

    server.inject(options, (response) => {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.thread, 'thread').to.equal(commentA.thread)
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread)
      Code.expect(result.text, 'text').to.equal(changesToA.text)

      done()
    })
  })

  lab.test('Delete', (done) => {
    const options = {
      method: 'DELETE',
      url: '/api/comments/' + commId,
      credentials: credentials
    }

    server.inject(options, (response) => {
      const result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.thread, 'thread').to.equal(commentA.thread)
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread)
      Code.expect(result.text, 'text').to.equal(changesToA.text)

      done()
    })
  })
})

const Lab = require('lab')
const Code = require('code')

const server = require('../').hapi

const lab = exports.lab = Lab.script()

const accessA = {
  member: 'john.doe',
  thread: 'company-example',
  last: Date.now
}

lab.experiment('Access', () => {
  lab.before((done) => setTimeout(() => done(), 1000))

  lab.test('Saving Access', (done) => {
    server.methods.access.save(accessA.member, '/companies', accessA.member, (err, result) => {
      Code.expect(err, 'err').to.be.null()
      done()
    })
  })

  lab.test('Getting Access', (done) => {
    server.methods.access.get(accessA.member, '/companies', accessA.member, (err, result) => {
      Code.expect(err, 'err').to.be.null()
      Code.expect(result.member).to.equal(accessA.member)
      done()
    })
  })
})

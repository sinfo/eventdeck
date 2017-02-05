const Boom = require('boom')
const slug = require('slug')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Company = require('../db/company')
const dupKeyParser = require('../helpers/dupKeyParser')

server.method('company.create', create, {})
server.method('company.update', update, {})
server.method('company.get', get, {})
server.method('company.getByMember', getByMember, {})
server.method('company.getByEvent', getByEvent, {})
server.method('company.list', list, {})
server.method('company.remove', remove, {})
server.method('company.search', search, {})

function create (company, memberId, cb) {
  company.id = slug(company.id || company.name).toLowerCase()
  company.updated = Date.now()

  Company.create(company, (err, _company) => {
    if (err) {
      if (err.code === 11000) {
        log.warn({err, requestedCompany: company.id}, 'company is a duplicate')
        return cb(Boom.conflict(dupKeyParser(err.err) + ' is a duplicate'))
      }

      log.error({err, company}, 'error creating company')
      return cb(Boom.internal())
    }
    cb(null, _company.toObject({ getters: true }))
  })
}

function update (id, company, cb) {
  company.updated = Date.now()

  Company.findOneAndUpdate({id: id}, company, {new: true}, (err, _company) => {
    if (err) {
      log.error({err, company: id}, 'error updating company')
      return cb(Boom.internal())
    }
    if (!_company) {
      log.warn({err: 'not found', company: id}, 'error updating company')
      return cb(Boom.notFound())
    }

    cb(null, _company)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  Company.findOne({id: id}, fields, (err, company) => {
    if (err) {
      log.error({err, company: id}, 'error getting company')
      return cb(Boom.internal())
    }
    if (!company) {
      log.warn({err: 'not found', company: id}, 'error getting company')
      return cb(Boom.notFound())
    }

    cb(null, company)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query // fields is optional

  const filter = { participations: { $elemMatch: { member: memberId } } }
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Company.find(filter, fields, options, (err, companies) => {
    if (err) {
      log.error({err, member: memberId}, 'error getting companies')
      return cb(Boom.internal())
    }

    cb(null, companies)
  })
}

function getByEvent (eventId, query, cb) {
  cb = cb || query // fields is optional

  const filter = { participations: { $elemMatch: { event: eventId } } }
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Company.find(filter, fields, options, (err, companies) => {
    if (err) {
      log.error({err, event: eventId}, 'error getting companies')
      return cb(Boom.internal())
    }

    cb(null, companies)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional
  let eventsFilter = {}
  let filter = {}
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  if (typeof query.member !== 'undefined') {
    if (query.member === false) {
      query.member = { $exists: false }
    }
    eventsFilter.member = query.member
  }
  if (query.event) {
    eventsFilter.event = query.event
  }

  if (eventsFilter.event || eventsFilter.member) {
    filter.participations = query.participations ? {$elemMatch: eventsFilter} : {$not: {$elemMatch: eventsFilter}}
  }

  Company.find(filter, fields, options, (err, companies) => {
    if (err) {
      log.error({err}, 'error getting all companies')
      return cb(Boom.internal())
    }

    cb(null, companies)
  })
}

function remove (id, cb) {
  Company.findOneAndRemove({id: id}, (err, company) => {
    if (err) {
      log.error({err, company: id}, 'error deleting company')
      return cb(Boom.internal())
    }
    if (!company) {
      log.warn({err: 'not found', company: id}, 'error deleting company')
      return cb(Boom.notFound())
    }

    return cb(null, company)
  })
}

function search (str, query, cb) {
  cb = cb || query // fields is optional

  let filter = { name: new RegExp(str, 'i') }
  const fields = parser(query.fields || 'id,name,img')
  const options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  }

  Company.find(filter, fields, options, function (err, exactCompanies) {
    if (err) {
      log.error({err, filter}, 'error getting companies')
      return cb(Boom.internal())
    }

    if (exactCompanies.length > 0) {
      return cb(null, { exact: exactCompanies })
    }

    filter = {
      $or: [
        { contacts: new RegExp(str, 'i') },
        { area: new RegExp(str, 'i') },
        { history: new RegExp(str, 'i') },
        { 'participations.status': new RegExp(str, 'i') }
      ]
    }

    Company.find(filter, fields, options, (err, extendedCompanies) => {
      if (err) {
        log.error({err, filter}, 'error getting companies')
        return cb(Boom.internal())
      }

      return cb(null, { exact: exactCompanies, extended: extendedCompanies })
    })
  })
}

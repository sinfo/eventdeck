var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var parser = require('server/helpers/fieldsParser');
var Company = require('server/db/company');


server.method('company.create', create, {});
server.method('company.update', update, {});
server.method('company.get', get, {});
server.method('company.getByMember', getByMember, {});
server.method('company.getByEvent', getByEvent, {});
server.method('company.list', list, {});
server.method('company.remove', remove, {});
server.method('company.search', search, {});


function create(company, memberId, cb) {
  company.id = slug(company.id || company.name).toLowerCase();
  company.updated = Date.now();

  Company.create(company, function(err, _company) {
    if (err) {
      log.error({ err: err, company: company}, 'error creating company');
      return cb(Boom.internal());
    }

    cb(null, _company.toObject({ getters: true }));
  });
}

function update(id, company, cb) {
  company.updated = Date.now();

  Company.findOneAndUpdate({id: id}, company, function(err, _company) {
    if (err) {
      log.error({ err: err, company: id}, 'error updating company');
      return cb(Boom.internal());
    }
    if (!_company) {
      log.warn({ err: 'not found', company: id}, 'error updating company');
      return cb(Boom.notFound());
    }

    cb(null, _company);
  });
}

function get(id, query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);
  Company.findOne({id: id}, fields, function(err, company) {
    if (err) {
      log.error({ err: err, company: id}, 'error getting company');
      return cb(Boom.internal());
    }
    if (!company) {
      log.warn({ err: 'not found', company: id}, 'error getting company');
      return cb(Boom.notFound());
    }

    cb(null, company);
  });
}

function getByMember(memberId, query, cb) {
  cb = cb || query; // fields is optional

  var filter = { participations: { $elemMatch: { member: memberId } } };
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Company.find(filter, fields, options, function(err, companies) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting companies');
      return cb(Boom.internal());
    }

    cb(null, companies);
  });
}

function getByEvent(eventId, query, cb) {
  cb = cb || query; // fields is optional

  var filter = { participations: { $elemMatch: { event: eventId } } };
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Company.find(filter, fields, options, function(err, companies) {
    if (err) {
      log.error({ err: err, event: eventId}, 'error getting companies');
      return cb(Boom.internal());
    }

    cb(null, companies);
  });
}

function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Company.find(filter, fields, options, function(err, companies) {
    if (err) {
      log.error({ err: err}, 'error getting all companies');
      return cb(Boom.internal());
    }

    cb(null, companies);
  });
}

function remove(id, cb) {
  Company.findOneAndRemove({id: id}, function(err, company){
    if (err) {
      log.error({ err: err, company: id}, 'error deleting company');
      return cb(Boom.internal());
    }
    if (!company) {
      log.error({ err: err, company: id}, 'error deleting company');
      return cb(Boom.notFound());
    }

    return cb(null, company);
  });
}

function search(str, query, cb) {
  cb = cb || query; // fields is optional

  var filter = { name: new RegExp(str, 'i') };
  var fields = parser(query.fields || 'id,name,img');
  var options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  };

  Company.find(filter, fields, options, function(err, exactCompanies) {
    if (err) {
      log.error({ err: err, filter: filter}, 'error getting companies');
      return cb(Boom.internal());
    }

    if (exactCompanies.length > 0) {
      return cb(null, { exact: exactCompanies });
    }

    filter = {
      $or: [
        { contacts: new RegExp(str, 'i') },
        { area: new RegExp(str, 'i') },
        { history: new RegExp(str, 'i') },
        { 'participations.status': new RegExp(str, 'i') },
      ]
    };

    Company.find(filter, fields, options, function(err, extendedCompanies) {
      if (err) {
        log.error({ err: err, filter: filter}, 'error getting companies');
        return cb(Boom.internal());
      }

      return cb(null, { exact: exactCompanies, extended: extendedCompanies });
    });

  });
}


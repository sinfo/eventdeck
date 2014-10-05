var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Company = require('server/db/models/company');


server.method('company.create', create, {});
server.method('company.update', update, {});
server.method('company.get', get, {});
server.method('company.getByMember', getByMember, {});
server.method('company.list', list, {});
server.method('company.remove', remove, {});


function create(company, memberId, cb) {
  company.id = slug(company.name);
  company.updated = Date.now();

  Company.create(company, function(err, _company) {
    if (err) {
      log.error({ err: err, company: company}, 'error creating company');
      return cb(Boom.internal());
    }

    cb(null, _company);
  });
};

function update(id, company, cb) {
  company.updated = Date.now();

  Company.findOneAndUpdate({_id: id}, company, function(err, _company) {
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
};

function get(id, cb) {
  Company.findOne({_id: id}, function(err, company) {
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
};

function getByMember(memberId, cb) {
  Company.find({ participations: { $elemMatch: { member: memberId } } }, function(err, companies) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting companies');
      return cb(Boom.internal());
    }

    cb(null, companies);
  });
};

function list(cb) {
  Company.find({}, function(err, companies) {
    if (err) {
      log.error({ err: err}, 'error getting all companies');
      return cb(Boom.internal());
    }
    
    cb(null, companies);
  });
};

function remove(id, cb) {
  Company.findOneAndRemove({_id: id}, function(err, company){
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
};
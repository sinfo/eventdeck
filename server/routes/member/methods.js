var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var fieldsParser = require('server/helpers/fieldsParser');
var randtoken = require('rand-token');
var Member = require('server/db/models/member');

// TODO: GET TARGETS
server.method('member.create', create, {});
server.method('member.update', update, {});
server.method('member.createLoginCode', createLoginCode, {});
server.method('member.get', get, {});
server.method('member.getByRole', getByRole, {});
server.method('member.getTeamLeaders', getTeamLeaders, {});
server.method('member.getSubscribers', getSubscribers, {});
server.method('member.list', list, {});
server.method('member.remove', remove, {});


function create(member, cb) {
  member.id = member.id || slug(member.name);

  Member.create(member, function(err, _member) {
    if (err) {
      log.error({ err: err, member: member}, 'error creating member');
      return cb(Boom.internal());
    }

    cb(null, _member);
  });
};

function update(id, member, cb) {
  Member.findOneAndUpdate({$or:[{id: id}, {_id: id}]}, member, function(err, _member) {
    if (err) {
      log.error({ err: err, member: id}, 'error updating member');
      return cb(Boom.internal());
    }
    if (!_member) {
      log.warn({ err: 'not found', member: id}, 'error updating member');
      return cb(Boom.notFound());
    }

    cb(null, _member);
  });
};

function createLoginCode(id, cb) {
  var loginCode = randtoken.generate(4).toUpperCase();

  Member.findOneAndUpdate({$or:[{id: id}, {_id: id}]}, {$push: {'loginCode': {code: loginCode, created: new Date()}}}, function(err, _member) {
    if (err) {
      log.error({ err: err, member: id}, 'error creating login code for member');
      return cb(Boom.internal());
    }
    if (!_member) {
      log.warn({ err: 'not found', member: id}, 'error creating login code for member');
      return cb(Boom.notFound());
    }

    cb(null, _member, loginCode);
  });
};

function get(id, fields, cb) {
  cb = cb || fields; // fields is optional

  Member.findOne({$or:[{id: id}, {_id: id}, {'facebook.id': id}]}, fieldsParser(fields), function(err, member) {
    if (err) {
      log.error({ err: err, member: id}, 'error getting member');
      return cb(Boom.internal());
    }
    if (!member) {
      log.warn({ err: 'not found', member: id}, 'error getting member');
      return cb(Boom.notFound());
    }

    cb(null, member);
  });
};

function getByRole(roleId, cb) {
  Member.find({'roles.id': roleId}, function(err, members) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
  });
};

function getTeamLeaders(cb) {
  Member.find({'roles.isTeamLeader': true}, function(err, members) {
    if (err) {
      log.error({ err: err, isTeamLeader: true}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
  });
};

function getSubscribers(thread, cb) {
  Member.find({$or:[{'subscriptions.threads': thread}, {'subscriptions.all': true}]}, function(err, members) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
  });
};

function list(fields, cb) {
  cb = cb || fields; // fields is optional

  Member.find({}, fieldsParser(fields), function(err, members) {
    if (err) {
      log.error({ err: err}, 'error getting all members');
      return cb(Boom.internal());
    }
    
    cb(null, members);
  });
};

function remove(id, cb) {
  Member.findOneAndRemove({$or:[{id: id}, {_id: id}]}, function(err, member){
    if (err) {
      log.error({ err: err, member: id}, 'error deleting member');
      return cb(Boom.internal());
    }
    if (!member) {
      log.error({ err: err, member: id}, 'error deleting member');
      return cb(Boom.notFound());
    }

    return cb(null, member);
  });
};
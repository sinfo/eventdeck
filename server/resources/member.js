var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var parser = require('server/helpers/fieldsParser');
var dupKeyParser = require('server/helpers/dupKeyParser');
var randtoken = require('rand-token');
var Member = require('server/db/member');

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
  member.id = slug(member.id || member.name).toLowerCase();

  Member.create(member, function(err, _member) {
    if (err) {
      if(err.code == 11000) {
        log.warn({err:err, requestedMember: member.id}, 'member is a duplicate');
        return cb(Boom.conflict(dupKeyParser(err.err)+' is a duplicate'));
      }

      log.error({ err: err, member: member}, 'error creating member');
      return cb(Boom.internal());
    }

    cb(null, _member);
  });
}

function update(id, member, cb) {
  Member.findOneAndUpdate({id: id}, member, function(err, _member) {
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
}

function createLoginCode(id, cb) {
  var loginCode = randtoken.generate(4).toUpperCase();
  var code = {$push: {'loginCodes': {code: loginCode, created: new Date()}}};
  var filter = {_id: id};
  Member.findOneAndUpdate(filter,code , function(err, _member) {
    if (err) {
      log.error({ err: err, member: id}, 'error creating login code for member');
      return cb(Boom.internal());
    }
    if (!_member) {
      log.warn({ err: 'not found', member: id}, 'error creating login code for member');
      return cb(Boom.notFound('member not found'));
    }

    log.info({member: id, loginCode: loginCode}, 'login code created');

    cb(null, {member: _member, loginCode: loginCode} );
  });
}

function get(id, query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);
  var filter = {$or:[{id: id}, {'facebook.id': id}]};
  Member.findOne(filter, fields, function(err, member) {
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
}

function getByRole(roleId, query, cb) {
  cb = cb || query; // fields is optional


  var filter = { participations: { $elemMatch: { event: roleId } } };
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Member.find(filter,fields,options, function(err, members) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
  });
}

function getTeamLeaders(query, cb) {
  cb = cb || query; // fields is optional

    var filter ={'roles.isTeamLeader': true};
    var fields = parser(query.fields);
    var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Member.find(filter,fields,options, function(err, members) {
    if (err) {
      log.error({ err: err, isTeamLeader: true}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
  });
}

function getSubscribers(thread,query, cb) {
  cb = cb||query;

  var filter = {$or:[{'subscriptions.threads': thread}, {'subscriptions.all': true}]};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Member.find(filter,fields,options, function(err, members) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting members');
      return cb(Boom.internal());
    }

    cb(null, members);
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

  Member.find(filter,fields,options, function(err, members) {
    if (err) {
      log.error({ err: err}, 'error getting all members');
      return cb(Boom.internal());
    }
    
    cb(null, members);
  });
}

function remove(id, cb) {
  var filter = {id: id};
  Member.findOneAndRemove(filter, function(err, member){
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
}
var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var url_prefix = require('config').url;
var threadFromPath = require('server/helpers/threadFromPath');
var Access = require('server/db/models/access');


server.method('access.save', save, {});


function save(memberId, path, id, cb) {

  var filter = { member: memberId, thread: threadFromPath(path, id) };
  var access = { 
    member: memberId, 
    thread: threadFromPath(path, id),
    last: Date.now()
  };

  Access.findOneAndUpdate(filter, access, {upsert: true}, function (err, savedAccess) {
    if (err) {
      log.error({ err: err, access: access});
      return cb(Boom.internal());
    }

    return cb(null, savedAccess);
  });

}
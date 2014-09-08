var async   = require('async');
var Company = require('./../../db/models/company.js');
var log = require('../../helpers/logger');

module.exports = track;

function track(request, reply) {

  var company;
  var access;

  async.series([
    getCompany,
    addAccess,
    saveCompany
  ], done);

  function getCompany(cb) {
    Company.findById(request.params.id, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find company \'' + request.params.id + '\'.');
      }
      
      company = result[0];
      cb();
    }
  }

  function addAccess(cb) {
    access = {
      date: Date.now(),
      where: 'page'
    };
    cb();
  }

  function saveCompany(cb) {
    if(request.auth.isAuthenticated) {
      return cb('Viewer is a member.');
    }

    Company.update({ id: company.id }, { $push: {accesses: access} }, function (err){
      if (err) {
        return cb(err);
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err}, '[company] error tracking page view from %s', request.params.id);
    }

    log.info('[company] sponsor page access from %s', request.params.id);

    reply.view('sponsor.html', {
      name: company.name
    });
  }
}

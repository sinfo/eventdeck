var async         = require('async');
var Company       = require('../../db/models/company');
var Member        = require('../../db/models/member');
var Communication = require('../../db/models/communication');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var companyId = request.params.id;
  var company   = {};

  async.series([
    getCompany,
  ], done);

  function getCompany(cb) {
    Company.findById(companyId, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find company with id \'' + companyId + '\'.');
      }

      company = result[0];
      cb();
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, company: request.params.id}, '[company] error previewing initial email');
      return reply.view('error.html', { error: 'There was an error.' });
    }

    log.info({username: request.auth.credentials.id, company: request.params.id}, '[company] sent inital email');
    reply.view('companyTemplate.html', {
      company: company
    });
  }

}

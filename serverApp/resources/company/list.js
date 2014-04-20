var async          = require('async');
var Company        = require('./../../db/models/company.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var companies;

  async.series([
      getCompanies,
    ], done);

  function getCompanies(cb) {
    Company.findAll(gotCompanies);

    function gotCompanies(err, result) {
      if (err) cb(err);
      companies = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(companies);
    }
  }
}
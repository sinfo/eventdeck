var Hapi           = require('hapi');
var async          = require('async');
var Company        = require('./../../db/models/company.js');
var notification  = require('./../notification');

exports = module.exports = get;

/// get Company

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
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)            { company.id            = result[0].id; }
        if (result[0].name)          { company.name          = result[0].name; }
        if (result[0].img)           { company.img           = result[0].img; }
        if (result[0].description)   { company.description   = result[0].description; }
        if (result[0].status)        { company.status        = result[0].status; }
        if (result[0].history)       { company.history       = result[0].history; }
        if (result[0].contacts)      { company.contacts      = result[0].contacts; }
        if (result[0].forum)         { company.forum         = result[0].forum; }
        if (result[0].member)        { company.member        = result[0].member; }
        if (result[0].area)          { company.area          = result[0].area; }
        if (result[0].participation) { company.participation = result[0].participation; }
        if (result[0].updated)       { company.updated       = result[0].updated; }
        if (result[0].access)        { company.access        = result[0].access; }
        if (result[0].accesses)      { company.accesses      = result[0].accesses; }

        cb();
      }
      else {
        cb(Hapi.error.conflict('No company with the ID: ' + companyId));
      }
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      notification.read(request.auth.credentials.id, 'company-' + companyId);
      reply(company);
    }
  }
}

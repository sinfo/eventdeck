var async   = require('async');
var Company = require('./../../db/models/company.js');

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
        cb(err);
      }
      else if (result && result.length > 0) {
        company = result[0];
        cb();
      }
      else {
        cb("Could not find company '" + request.params.id + "'.");
      }
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
    if(!request.auth.isAuthenticated) {
      Company.update({ id: company.id }, { $push: {accesses: access} }, function (err){
        if (err) {
          cb(err);
        }
        else {
          cb();
        }
      });
    }
    else {
      cb("Viewer is a member.");
    }
  }

  function done(err) {
    if (err) {
      console.log("Error in page tracker for '" + request.params.id + "'.");
    }

    reply.view('sponsor.html', {
      name: company.name
    });
  }
}

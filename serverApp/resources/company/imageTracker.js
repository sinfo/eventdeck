var Hapi           = require('hapi');
var async          = require('async');
var Company        = require('./../../db/models/company.js');

exports = module.exports = track;

function track(request, reply) {

  var companyId = request.params.id;
  var company = {};
  var access;
  var accesses = [];

  async.series([
      getCompany,
      addAccess,
      saveCompany,
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
        if (result[0].accesses)      { accesses              = result[0].accesses; }
        cb();
      }
      else {
        cb(Hapi.error.conflict('No company with the ID: ' + companyId));
      }
    }
  }

  function addAccess(cb) {
    access = {
      date: Date.now()
      //'user-agent': request.headers['user-agent'],
      //info: request.info
    }

    accesses[accesses.length] = access;

    cb();
  }

  function saveCompany(cb) {
    var query = {
      id: company.id
    };
    
    console.log(access);

    Company.update(query, { access: access }, function (err, numAffected){
      if (err) {
        console.log(err);
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }

      console.log("UPDATED", numAffected)
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      //console.log(err);
    } 

    //reply(JSON.stringify(request, undefined, 2));
    //reply(request);
    reply.file("./public/img/logo.jpg");
  }

}
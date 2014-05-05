var Hapi           = require('hapi');
var async          = require('async');
var Company        = require('./../../db/models/company.js');
var notification  = require('./../notification');

exports = module.exports = create;

/// create Company

function create(request, reply) {

  var company = {};

  async.series([
      checkCompany,
      createCompany,
      saveCompany,
    ], done);

  function checkCompany(cb) {
    if(request.payload.id) {
      Company.findById(request.payload.id, function(err, company) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (company.length > 0) {
          return cb(Hapi.error.conflict('Company ID exists: '+request.payload.id));
        } else {
          console.log("GOGOGO");
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createCompany(cb) {
    company.id   = request.payload.id;
    company.name = request.payload.name;
    if (request.payload.img)           { company.img           = request.payload.img; }
    if (request.payload.description)   { company.description   = request.payload.description; }
    if (request.payload.status)        { company.status        = request.payload.status; }
    if (request.payload.history)       { company.history       = request.payload.history; }
    if (request.payload.contacts)      { company.contacts      = request.payload.contacts; }
    if (request.payload.forum)         { company.forum         = request.payload.forum; }
    if (request.payload.member)        { company.member        = request.payload.member; }
    if (request.payload.area)          { company.area          = request.payload.area; }
    if (request.payload.participation) { company.participation = request.payload.area; }

    cb();
  }

  function saveCompany(cb) {
    var newCompany = new Company(company);

    newCompany.save(function (err, reply){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        cb();
      } else { // same id        
        return cb(Hapi.error.conflict('Company ID exists: '+request.payload.id));
      }
      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {

      notification.new(request.auth.credentials.id, 'company-'+company.id, company.name, "company",request.auth.credentials.name);
      reply({message:"Company Updated!"});
    }
  }
}
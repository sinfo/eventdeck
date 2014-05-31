var async        = require('async');
var Company      = require('./../../db/models/company.js');
var notification = require('./../notification');

module.exports = create;

function create(request, reply) {

  var company = request.payload;

  async.series([
    checkCompany,
    saveCompany
  ], done);

  function checkCompany(cb) {
    if(company.name) {
      company.id = createId(company.name);

      Company.findById(company.id, function (err, result) {
        if (err) {
          cb(err);
        }
        else if (result && result.length > 0) {
          cb("Company id '" + company.id + "'already exists.");
        }
        else {
          cb();
        }
      });
    }
    else {
      cb("Company name was not specified.");
    }
  }

  function saveCompany(cb) {
    var newCompany = new Company(company);

    newCompany.save(function (err){
      if (err) {
        cb(err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: "Error creating the company."});
    }
    else {
      notification.notify(request.auth.credentials.id, 'company-'+company.id, 'created a new company', null);

      reply({success: "Company created."});
    }
  }
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}


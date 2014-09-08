var async        = require('async');
var Company      = require('../../db/models/company');
var notification = require('../notification');
var log          = require('../../helpers/logger');

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
          return cb(err);
        }
        if (result && result.length > 0) {
          return cb('Company id \'' + company.id + '\'already exists.');
        }
        
        cb();
      });
    }
    else {
      cb('Company name was not specified.');
    }
  }

  function saveCompany(cb) {
    var newCompany = new Company(company);

    newCompany.save(function (err){
      if (err) {
        return cb(err);
      }
    
      cb();
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[company] error creating company');
      return reply({error: 'Error creating the company.'});
    }

    var targets = [];
    if(request.auth.credentials.id != company.member) {
      targets.push(company.member);
    }
    notification.notify(request.auth.credentials.id, 'company-'+company.id, 'created a new company', null);

    log.info('[company] %s created new company (%s)', request.auth.credentials.id, company.id);
    reply({success: 'Company created.', id:company.id});
  }
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}


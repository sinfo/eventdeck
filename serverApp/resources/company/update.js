var async         = require('async');
var Company       = require('./../../db/models/company.js');
var email         = require('./../email');
var notification  = require('./../notification');
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  var company = {};
  var diffCompany = {};

  async.series([
    getCompany,
    checkPermission,
    updateCompany,
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

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination' || o.id == 'treasury';
    });

    /*
    if(roles.length == 0 && request.payload.participations && request.payload.participations.payment && request.payload.participations.payment.status) {
      return cb('You don\'t have permissions for this.');
    }
    */

    cb();
  }

  function updateCompany(cb) {
    if (request.payload.id && request.payload.id != company.id)                                            { diffCompany.id            = request.payload.id; }
    if (request.payload.name && request.payload.name != company.name)                                      { diffCompany.name          = request.payload.name; }
    if (request.payload.img && request.payload.img != company.img)                                         { diffCompany.img           = request.payload.img; }
    if (request.payload.description && request.payload.description != company.description)                 { diffCompany.description   = request.payload.description; }
    if (request.payload.status && request.payload.status != company.status)                                { diffCompany.status        = request.payload.status; }
    if (request.payload.history && request.payload.history != company.history)                             { diffCompany.history       = request.payload.history; }
    if (request.payload.contacts && request.payload.contacts != company.contacts)                          { diffCompany.contacts      = request.payload.contacts; }
    if (request.payload.forum && request.payload.forum != company.forum)                                   { diffCompany.forum         = request.payload.forum; }
    if (request.payload.member && request.payload.member != company.member)                                { diffCompany.member        = request.payload.member; }
    if (request.payload.area && request.payload.area != company.area)                                      { diffCompany.area          = request.payload.area; }
    if (request.payload.participations && !equals(request.payload.participations, company.participations)) { diffCompany.participations = request.payload.participations; }

    if (isEmpty(diffCompany)) {
      return cb('Nothing changed.');
    }

    diffCompany.updated = Date.now();
    cb();
  }

  function saveCompany(cb) {
    Company.update({id: company.id}, diffCompany, function (err){
      if (err) {
        return cb('Error on database');
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, company: request.params.id}, '[company] error updating the company');

      if (err == 'Nothing changed.') {
        return reply({error: 'Nothing changed.'});
      }
      else {
        return reply({error: 'There was an error updating the company.'});
      }
    }
   
    if (diffCompany.member) {
      email.companyAttribute(diffCompany.member, company);
    }

    var targets = [];
    if(request.auth.credentials.id != company.member) {
      targets.push(company.member);
    }

    log.info({username: request.auth.credentials.id, company: request.params.id}, '[company] company updated');

    notification.notify(request.auth.credentials.id, 'company-'+company.id, 'updated '+getEditionString(diffCompany), null, targets);

    reply({success: 'Company updated.'});
  }
}

function getEditionString(diffObject) {
  var editionsArray = [];
  for(var propertyName in diffObject) {
    if(propertyName != 'updated'){
      editionsArray.push(propertyName);
    }
  }
  var editions = editionsArray[0];
  if(editionsArray.length > 1){
    editions = editionsArray.slice(0, -1).join(', ')+ ' and ' +editionsArray[editionsArray.length -1];
  }

  return editions;
}

function equals(o1, o2) {
  if(typeof(o1) != typeof(o2)) { return false; }

  if(o1.length && o1.length != o2.length) { return false; } 
  
  for (var key in o1) {
    var type = typeof(o1[key]);
    if (type == 'object') {
      if (!equals(o1[key], o2[key]))
        return false;
    }
    else{
      if (o1[key] != o2[key])
        return false;
    }
  }

  return true;
}

function isEmpty(o) {
  for (var key in o) {
    return false;
  }
  return true;
}

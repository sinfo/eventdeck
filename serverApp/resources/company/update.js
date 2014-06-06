var async         = require('async');
var Company       = require('./../../db/models/company.js');
var email         = require('./../email');
var notification  = require('./../notification');

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

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination' || o.id == 'treasury';
    });

    if(roles.length == 0 && request.payload.participation && request.payload.participation.payment && request.payload.participation.payment.status) {
      return cb('You don\'t have permissions for this.');
    }
    
    cb();
  }

  function updateCompany(cb) {
    if (request.payload.id != company.id)                              { diffCompany.id            = request.payload.id; }
    if (request.payload.name != company.name)                          { diffCompany.name          = request.payload.name; }
    if (request.payload.img != company.img)                            { diffCompany.img           = request.payload.img; }
    if (request.payload.description != company.description)            { diffCompany.description   = request.payload.description; }
    if (request.payload.status != company.status)                      { diffCompany.status        = request.payload.status; }
    if (request.payload.history != company.history)                    { diffCompany.history       = request.payload.history; }
    if (request.payload.contacts != company.contacts)                  { diffCompany.contacts      = request.payload.contacts; }
    if (request.payload.forum != company.forum)                        { diffCompany.forum         = request.payload.forum; }
    if (request.payload.member != company.member)                      { diffCompany.member        = request.payload.member; }
    if (request.payload.area != company.area)                          { diffCompany.area          = request.payload.area; }
    if (!equals(request.payload.participation, company.participation)) { diffCompany.participation = request.payload.participation; }

    if (isEmpty(diffCompany)) {
      cb("Nothing changed.");
    }
    else {
      diffCompany.updated = Date.now();
      cb();
    }
  }

  function saveCompany(cb) {
    Company.update({id: company.id}, diffCompany, function (err){
      if (err) {
        cb('Error on database');
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      console.log(err);
      if (err == "Nothing changed.") {
        reply({error: "Nothing changed."})
      }
      else {
        reply({error: "There was an error updating the company."});
      }
    }
    else {
      if (diffCompany.member) {
        email.companyAttribute(diffCompany.member, company);
      }

      var targets = [];
      if(request.auth.credentials.id != company.member) {
        targets.push(company.member);
      }
      notification.notify(request.auth.credentials.id, 'company-'+company.id, 'updated '+getEditionString(diffCompany), null, targets);

      reply({success: "Company updated."});
    }
  }
}

function getEditionString(diffObject) {
  var editionsArray = [];
  for(var propertyName in diffObject) {
    if(propertyName != "updated"){
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
  for (var key in o1) {
    var type = typeof(o1[key]);
    if (type == "object") {
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
  for (key in o)
    return false;
  return true;
}

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
    Company.update({id: company.id}, company, function (err){
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

      notification.update(request.auth.credentials.id, "company-" + company.id, company.name, request.auth.credentials.name, diffCompany);
      reply({success: "Company updated."});
    }
  }
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

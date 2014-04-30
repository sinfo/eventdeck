var Hapi           = require('hapi');
var async          = require('async');
var Company        = require('./../../db/models/company.js');
var email       = require('./../email');

exports = module.exports = update;

/// update Company

function update(request, reply) {

  var companyId = request.params.id;
  var company = {};
  var diffCompany = {};

  async.series([
      getCompany,
      updateCompany,
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

    
        cb();
      }
      else {
        cb(Hapi.error.conflict('No company with the ID: ' + companyId));
      }
    }
  }

  function updateCompany(cb) {
    console.log(request.payload.member, company.member, request.payload.member != company.member)

    if (request.payload.id != company.id)                       { diffCompany.id            = request.payload.id; }
    if (request.payload.name != company.name)                   { diffCompany.name          = request.payload.name; }
    if (request.payload.img != company.img)                     { diffCompany.img           = request.payload.img; }
    if (request.payload.description != company.description)     { diffCompany.description   = request.payload.description; }
    if (request.payload.status != company.status)               { diffCompany.status        = request.payload.status; }
    if (request.payload.history != company.history)             { diffCompany.history       = request.payload.history; }
    if (request.payload.contacts != company.contacts)           { diffCompany.contacts      = request.payload.contacts; }
    if (request.payload.forum != company.forum)                 { diffCompany.forum         = request.payload.forum; }
    if (request.payload.member != company.member)               { diffCompany.member        = request.payload.member; }
    if (request.payload.area != company.area)                   { diffCompany.area          = request.payload.area; }
    if (request.payload.participation != company.participation) { diffCompany.participation = request.payload.participation; }

    diffCompany.updated = Date.now();

    console.log("DIFF", diffCompany)

    cb();
  }

  function saveCompany(cb) {
    var query = {
      id: company.id
    };
    if(diffCompany.id) {
      query = company;
    }
    Company.update(query, diffCompany, {}, function (err, numAffected){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }

      console.log("UPDATED", numAffected)
      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      if(diffCompany.member) { email.companyAttribute(diffCompany.member, company); }
      reply({message:"Company Updated!"});
    }
  }
}
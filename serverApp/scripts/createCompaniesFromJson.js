var async = require('async');
var companies = require('./companiesForumXX');
var Company   = require('./../db/models/company.js');
require('./../db');

setTimeout(function() {
  /*
  for (var i = 0; i < companies.length; i++) {
    var company = {};

    company.id   = companies[i].id;
    company.name = companies[i].name;
    if (companies[i].img)          { company.img         = companies[i].img; }
    if (companies[i].description)  { company.description = companies[i].description; }
    if (companies[i].status)       { company.status      = companies[i].status; }
    if (companies[i].history)      { company.history     = companies[i].history; }
    if (companies[i].contacts)     { company.contacts    = companies[i].contacts; }
    if (companies[i].forum["XXI"]) { company.forum       = companies[i].forum["XXI"]; }
    if (companies[i].status["XXI"]){ company.status      = companies[i].status["XXI"]; }
    if (companies[i].member["XXI"]){ company.member      = companies[i].member["XXI"]; }
    if (companies[i].area)         { company.area        = companies[i].area; }
    
    var newCompany = new Company(company);

    newCompany.save(function (err, reply){
      if (err) {
        console.log("ERROR",('Hipcup on the DB' + err.detail));
      } else if(reply) {
        console.log("SUCCESS", company);
      } else { // same id        
        console.log("ERROR",('Company ID exists: '+request.payload.id));
      }
    });
  }
  */

  async.each(companies, function(jsonCompany, callback) {

    var newCompany = {};

    Company.findByName(jsonCompany.name, function(err, result) {
      if (err) { callback(err); }

      if (result.length == 0) {
        console.log("missing", jsonCompany.name);

        var company = {};

        company.id   = jsonCompany.id;
        company.name = jsonCompany.name;
        if (jsonCompany.img)          { company.img         = jsonCompany.img; }
        if (jsonCompany.description)  { company.description = jsonCompany.description; }
        if (jsonCompany.status)       { company.status      = jsonCompany.status; }
        if (jsonCompany.history)      { company.history     = jsonCompany.history; }
        if (jsonCompany.contacts)     { company.contacts    = jsonCompany.contacts; }
        if (jsonCompany.forum["XX"])  { company.forum       = jsonCompany.forum["XX"]; }
        if (jsonCompany.status["XX"]) { company.status      = jsonCompany.status["XX"]; }
        if (jsonCompany.member["XX"]) { company.member      = jsonCompany.member["XX"]; }
        if (jsonCompany.area)         { company.area        = jsonCompany.area; }
        
        var newCompany = new Company(company);

        newCompany.save(function (err, reply){
          if (err) {
            console.log("ERROR",('Hipcup on the DB' + err.detail));
          } else if(reply) {
            console.log("SUCCESS", company);
          } else { // same id        
            console.log("ERROR",('Company ID exists: '+request.payload.id));
          }

          callback();
        });
      } else {
        //console.log("found", result[0].name);
        callback();
      }
    });
}, function(error) {
  if(error) { console.log("Error!!", error); }
  console.log("DONE");
});

}, 3000);
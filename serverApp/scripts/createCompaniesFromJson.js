var async = require('async');
var companies = require('./companies');
var Company   = require('./../db/models/company.js');
require('./../db');

setTimeout(function() {
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
        console.log("ERROR",Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        console.log("SUCCESS", company);
      } else { // same id        
        console.log("ERROR",Hapi.error.conflict('Company ID exists: '+request.payload.id));
      }
    });
  }
}, 3000);
var Hapi          = require('hapi');
var async         = require('async');
var Topic         = require('./../../db/models/topic.js');
var notification  = require('./../notification');

exports = module.exports = create;

/// create Company

function create(request, reply) {

  var newTopic = new Topic(request.payload);
  newTopic.posted = Date.now();
  newTopic.author = request.auth.credentials.id;
  newTopic.save(function (err){
    if (err) {
      reply({error:"There was an error!"});
    } else {
      //notification.new(request.auth.credentials.id, 'company-'+company.id, company.name, "company",request.auth.credentials.name);
      reply({success:"New topic!", id:newTopic._id});
    }
  });
}


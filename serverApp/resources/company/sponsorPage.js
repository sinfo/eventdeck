var Hapi           = require('hapi');
var async          = require('async');
var Company        = require('./../../db/models/company.js');

exports = module.exports = page;

function page(request, reply) {
	reply.view('sponsor.html', { 
  
  });
}

var Hapi = require('hapi');
var companies = require('./companies');

var companiesLookup = {};
for (var i = 0; i < companies.length; i++) {
    companiesLookup[companies[i].id] = companies[i];
}

exports = module.exports;

exports.list = function list(request, reply) {

  reply(companies);
};

exports.get = function get(request, reply) {
  var company = companiesLookup[request.params.id];

  reply({
    id: company.id,
    name: company.name,
    img: company.img,
    status: company.status,
    history: convertTextToHtml(company.history),
    contacts: convertTextToHtml(company.contacts),
    member: company.member,
    forum: company.forum, 
    post: convertTextToHtml(company.initial_post),
    area: company.area.replace("Área", "<b>Área</b>"),
    description: company.description.replace("Descrição", "<b>Descrição</b>")
  });
};

var convertTextToHtml = function (text){
  var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

  return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='mailto:$&'>$&</a>");    
}

var Hapi = require('hapi');
var companies = require('./companies');

var companiesLookup = {};
for (var i = 0; i < companies.length; i++) {
    companiesLookup[companies[i].id] = companies[i];
}

exports = module.exports;

exports.list = function list(request, reply) {

  reply.view('home.html', {
    companies: toGrid(companies)
  });
};

exports.get = function get(request, reply) {
  console.log(request.params);

  var company = companiesLookup[request.params.id];
  
  if(request.params.which === "next") {
    var index = companies.indexOf(company);
    if(index >= 0 && index < companies.length - 1) {
      company = companies[index + 1];
      return reply().redirect('/company/'+company.id);
     }
  } else if(request.params.which === "prev") {
    var index = companies.indexOf(company);
    if(index > 0 && index < companies.length) {
      company = companies[index - 1];
      return reply().redirect('/company/'+company.id);
     }
  }

  reply.view('company.html', {
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

var toGrid = function (data){
    var rows=[],
        step=6,
        i=0,
        L=data.length;
    
    for(; i<L ; i+=step){
        rows.push({cells:data.slice(i,i+step)});
    };

    return rows;
}

var convertTextToHtml = function (text){
  var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

  return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='mailto:$&'>$&</a>");    
}

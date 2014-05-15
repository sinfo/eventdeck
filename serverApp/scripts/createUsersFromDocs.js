var Tabletop = require('tabletop');
var Request  = require('request');
var async    = require('async');
var Member   = require('./../db/models/member.js');
require('./../db');

var sheetData  = [];
var commission = [];

var KEY = '0ArFdIIlHHZzpdEhaSXp5WktSdzR0Z2hLWkNibkd3dHc';

Tabletop.init({
  key: KEY,
  callback: function(data, tabletop) {
    sheetData = data;
    commission = sheetData["Comissão"].elements;

    array = [];
    for (var i = 0; i < commission.length; i++){
      array.push(i);
    }

    async.eachSeries(array, function(i, cb) {
      var member = {};

      if(commission[i].mailsinfo) {
        member.id = commission[i].mailsinfo.split('@')[0];
        if (commission[i].nome)   { member.name  = commission[i].nome;          }
        if (commission[i].naluno) { member.istId = 'ist1'+commission[i].naluno; }
        if (commission[i].cargo)  {
          var roles = [];
          for(var r in commission[i].cargo.split('/')) {
            r = commission[i].cargo.split('/')[r];
            var role = {
              id: createId(r.replace(' (TL)', '')),
              name: r.replace(' (TL)', ''),
              isTeamLeader: r.indexOf('(TL)') != -1 || r.indexOf('Manager') != -1
            };
            roles.push(role);
          }
          member.roles = roles;
        }
        if (commission[i].facebook)    { member.facebook      = commission[i].facebook;    }
        if (commission[i].skype)       { member.skype         = commission[i].skype;       }
        member.mails = {};
        if (commission[i].mailsinfo)   { member.mails.sinfo   = commission[i].mailsinfo;   }
        if (commission[i].mailist)     { member.mails.ist     = commission[i].mailist;     }
        if (commission[i].mailgoogle)  { member.mails.google  = commission[i].mailgoogle;  }
        if (commission[i].mailgoogle)  { member.mails.google  = commission[i].mailgoogle;  }
        if (commission[i].mailmsn)     { member.mails.msn     = commission[i].mailmsn;     }
        if (commission[i].maildropbox) { member.mails.dropbox = commission[i].maildropbox; }
        member.phones = [];
        if (commission[i]['telem.1'])  { member.phones.push(commission[i]['telem.1']);     }
        if (commission[i]['telem.2'])  { member.phones.push(commission[i]['telem.2']);     }

        Request("http://graph.facebook.com/" + member.facebook, {
          method: "GET",
          json: true
        }, function (error, response, result) {
          if (!error && response.statusCode == 200) {
            member.facebookId = result.id;

            var newMember = new Member(member);

            newMember.save(function (err, reply){
              if (err)
                console.log("ERROR", err, reply);
              else
                console.log("SUCCESS", reply.name);

              cb();
            });
          }
        });
      }
    }, function(err) {

    });
  },
  simpleSheet: false
});

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}

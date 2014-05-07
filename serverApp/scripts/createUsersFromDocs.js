var Tabletop = require('tabletop');
var Member   = require('./../db/models/member.js');
require('./../db');

var sheetData = [],
    commission = [];

var KEY = '0ArFdIIlHHZzpdEhaSXp5WktSdzR0Z2hLWkNibkd3dHc'


setTimeout(function() {
Tabletop.init({
    key: KEY,
    callback: function(data, tabletop) { 
      sheetData = data;
      commission = sheetData["Comissão"].elements;

      for (var i = 0; i < commission.length; i++) {
        var member = {};

        if(commission[i].mailsinfo) {
          member.id = commission[i].mailsinfo.split('@')[0];
          if (commission[i].nome)        { member.name          = commission[i].nome; }
          if (commission[i].naluno)      { member.istId         = 'ist1'+commission[i].naluno; }
          if (commission[i].cargo)       { 
            var roles = [];
            for(var r in commission[i].cargo.split('/')) {
              r = commission[i].cargo.split('/')[r]
              var role = {
                name: r.replace(' (TL)', '').toString(),
                isTeamLeader: r.indexOf('(TL)') != -1 || r.indexOf('Manager') != -1 
              }
              roles.push(role);
            }
            member.roles = roles; 
          }
          if (commission[i].facebook)    { member.facebook      = commission[i].facebook; }
          if (commission[i].skype)       { member.skype         = commission[i].skype; }
          member.mails = {};
          if (commission[i].mailsinfo)   { member.mails.sinfo   = commission[i].mailsinfo; }
          if (commission[i].mailist)     { member.mails.ist     = commission[i].mailist; }
          if (commission[i].mailgoogle)  { member.mails.google  = commission[i].mailgoogle; }
          if (commission[i].mailgoogle)  { member.mails.google  = commission[i].mailgoogle; }
          if (commission[i].mailmsn)     { member.mails.msn     = commission[i].mailmsn; }
          if (commission[i].maildropbox) { member.mails.dropbox = commission[i].maildropbox; }
          member.phones = [];
          if (commission[i]['telem.1'])  { member.phones.push(commission[i]['telem.1']); }
          if (commission[i]['telem.2'])  { member.phones.push(commission[i]['telem.2']); }

          var newMember = new Member(member);

          newMember.save(function (err, reply){
            if (err) {
              console.log("ERROR", err, reply);
            } 

            //console.log("SUCCESS", reply);
          });
        }
      }
    },
    simpleSheet: false 
});
}, 3000);
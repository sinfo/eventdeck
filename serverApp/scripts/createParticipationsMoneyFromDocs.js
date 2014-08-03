var Tabletop = require('tabletop');
var async = require('async');
var Company   = require('./../db/models/company.js');
require('./../db');

var sheetData = [],
    commission = [];

var KEY = '0ArFdIIlHHZzpdGZHMVZjR3RBNngyWEVWSWxfX3BaNmc'


setTimeout(function() {
Tabletop.init({
    key: KEY,
    callback: function(data, tabletop) { 
      sheetData = data['Budget Empresas'].elements;

      async.each(sheetData, function(row, callback) {

        var participation = {};

        Company.findByName(row.empresa, function(err, result) {
          if (err) { callback(err); }

          if (result.length == 1) {
            //console.log(row);
            if(!result[0].participations || !result[0].participations[0]) {
              participation = {};

              if(!result[0].participation) {
                participation.kind = 'Sponsor';
              } else {
                participation.kind = result[0].participation.kind;
              }

              participation.event = 'xxi-sinfo';
              participation.member = result[0].member;
              participation.status = 'Closed Deal';
            } 
            else {
              participation = result[0].participations[0];
            }

            participation.payment = {};

            participation.payment['price']   = eval(row['_cokwr'].split('€ ')[1]);
            participation.payment['iva']     = eval(row['iva'].split('€ ')[1]);
            participation.payment['total']   = eval(row['iva_2'].split('€ ')[1]);
            participation.payment['date']    = row['dataemissão'];
            participation.payment['invoice'] = row['factura'];
            participation.payment['status']  = row['estado'];
            participation.payment['via']     = row['via'];

            var participations = [participation];

            Company.update({id: result[0].id}, {participations: participations}, {}, function (err, numAffected){
              if (err) {
                callback('Hipcup on the DB' + err.detail);
              }

              console.log("UPDATED", numAffected);
              callback();
            });
          } else {
            console.log("missing", row.empresa, "from", row["responsável"]);
          }
        });
      }, function(error) {
        console.log("Error!!", error);
      });

    },
    simpleSheet: false 
});
}, 1000);
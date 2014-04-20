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

            if(result[0].participation) { participation = result[0].participation; }

            participation.payment = {};

            participation.payment['price']   = row['_cokwr'];
            participation.payment['iva']     = row['iva'];
            participation.payment['total']   = row['iva_2'];
            participation.payment['date']    = row['dataemissão'];
            participation.payment['invoice'] = row['factura'];
            participation.payment['status']  = row['estado'];
            participation.payment['via']     = row['via'];

            Company.update({id: result[0].id}, {participation: participation}, {}, function (err, numAffected){
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
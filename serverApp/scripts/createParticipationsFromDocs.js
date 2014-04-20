var Tabletop = require('tabletop');
var async = require('async');
var Company   = require('./../db/models/company.js');
require('./../db');

var sheetData = [],
    commission = [];

var KEY = '0AlerGTBjDfqxdEhsNGJmb2xWRDd1OW0wRzhBcFhWQWc'


setTimeout(function() {
Tabletop.init({
    key: KEY,
    callback: function(data, tabletop) { 
      sheetData = data;

      async.each(sheetData, function(row, callback) {

        if(row["tipodeparticipação"] == "Media Partner") { callback(); }

        var participation = {};

        Company.findByName(row.empresa, function(err, result) {
          if (err) { callback(err); }

          if (result.length == 1) {
            console.log(row);

            if(result[0].participation) { participation = result[0].participation; }

            participation.kind = row['tipodeparticipação'];

            Company.update({id: result[0].id}, {participation: participation}, {}, function (err, numAffected){
              if (err) {
                callback('Hipcup on the DB' + err.detail);
              }

              console.log("UPDATED", numAffected)
              callback();
            });
          } else {
            //console.log("missing", row.empresa, "from", row["responsável"]);
          }
        });
      }, function(error) {
        console.log("Error!!", error);
      });

    },
    simpleSheet: true 
});
}, 1000);
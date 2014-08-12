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

        if(row["tipodeparticipação"] == "Media Partner") { return callback(); }

        var participation = {};

        Company.findByName(row.empresa, function(err, result) {
          if (err) { return callback(err); }

          if (result.length == 1) {
            participation.event = 'xxi-sinfo';
            participation.kind = row['tipodeparticipação'];
            participation.member = row['responsável'].toLowerCase();
            participation.status = 'Closed Deal';

            participation.items = [];
            if(row['logocapassml'] != 'Não') {
              participation.items.push({
                id: 'logo-folders',
                kind: row['logocapassml']
              });
            }
            if(row['documentaçãonascapassimnãoadeterminar'] == 'Sim') {
              participation.items.push({
                id: 'documentation-folders'
              });
            }
            if(row['postsnasredes13ou5'] != 'Não') {
              participation.items.push({
                id: 'posts',
                amount: row['postsnasredes13ou5']
              });
            }
            if(row['logositesecçãopatrocínios'] != 'Não') {
              participation.items.push({
                id: 'logo-site-sponsors',
                kind: row['tamanhologosml']
              });
            }
            if(row['logositetodoolado'] != 'Não') {
              participation.items.push({
                id: 'logo-site-everywhere',
                kind: row['tamanhologosml']
              });
            }
            if(row['logonosrollupssml'] != 'Não') {
              participation.items.push({
                id: 'logo-rollups',
                kind: row['logonosrollupssml']
              });
            }
            if(row['logonosindividuaistabuleirosml'] != 'Não') {
              participation.items.push({
                id: 'logo-individuals',
                kind: row['logonosindividuaistabuleirosml']
              });
            }
            if(row['logoshowcasesml'] != 'Não') {
              participation.items.push({
                id: 'logo-showcase',
                kind: row['logoshowcasesml']
              });
            }
            if(row['logonosprogramasflyersml'] != 'Não') {
              participation.items.push({
                id: 'logo-flyers',
                kind: row['logonosprogramasflyersml']
              });
            }
            if(row['logonoscartazessml'] != 'Não') {
              participation.items.push({
                id: 'logo-posters',
                kind: row['logonoscartazessml']
              });
            }
            if(row['logonast-shirtsml'] != 'Não') {
              participation.items.push({
                id: 'logo-tshirts',
                kind: row['logonast-shirtsml']
              });
            }
            if(row['logonomerchandisesimnão'] == 'Sim') {
              participation.items.push({
                id: 'logo-merchandise'
              });
            }
            if(row['logonascanetassimnão'] == 'Sim') {
              participation.items.push({
                id: 'logo-pens'
              });
            }

            //console.log(row);

            console.log(result[0].id, participation);
            var participations = [participation];

            //Company.update({ id: result[0].id }, { $push: { participations: participation } }, {}, function (err, numAffected){
            Company.update({ id: result[0].id }, { participations: participations }, {}, function (err, numAffected){
              if (err) {
                return callback('Hipcup on the DB' + err.detail);
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
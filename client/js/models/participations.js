//Participations Model - participation.js
var AmpCollection = require('ampersand-collection');
var Participation = require('./participation');


module.exports = AmpCollection.extend({
  model: Participation
});

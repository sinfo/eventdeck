// company Model - company.js
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');

var Communication = require('./communication');
var Participation = require('./participation');


var CommunicationCollection = AmpCollection.extend({
    model: Communication
});

var ParticipationCollection = AmpCollection.extend({
  model: Participation
});

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    description: ['string'],
    img: ['string'],
    site:['string'],
    status:['status'],
    contacts:['string'],
    history:['string'],
    area:['string'],
    updated:['string']
  },
  collections: {
    communications: CommunicationCollection,
    participations: ParticipationCollection
  },
  session: {
    selected: ['boolean', true, false]
  },
  derived: {
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url('+this.img+'?width=150);';
      }
    },
    communicationsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/companies/' + this.id + '/communications';
      }
    },
    participation: {
      deps:['participations'],
      fn: function () {
        return this.participations.filter(function(p){ return p.event == app.me.selectedEvent; })[0];
      }
    }
  }
 });
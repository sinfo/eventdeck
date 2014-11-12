// company Model - company.js
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');

var Communication = require('./communication');

var CommunicationCollection = AmpCollection.extend({
    model: Communication
});


module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    img: ['string'],
    site:['string'],
    contacts:['string'],
    history:['string'],
    participations:['array'],
    items:['array'],
    area:['string'],
    accesses:['array'],
    updated:['string']
  },
  collections: {
    communications: CommunicationCollection
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
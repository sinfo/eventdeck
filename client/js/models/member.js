/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var MemberParticipation = require('./memberParticipation');


var Facebook = AmpState.extend({
  props: {
    id: 'string',
    username: 'string'
  }
});

var Mails = AmpState.extend({
  props: {
    main: 'string',
    institutional: 'string',
    dropbox: 'string',
    google: 'string',
    microsoft: 'string',
  }
});


var ParticipationCollection = AmpCollection.extend({
    model: MemberParticipation
});

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    img: ['string'],
    skype: ['string'],
    phones: ['array']
  },
  children: {
    facebook: Facebook,
    mails: Mails
  },
  collections: {
    participations: ParticipationCollection
  },

  derived: {
    isAdmin: {
      deps: ['roles'],
      fn: function () {
        return this.roles.filter(function (role) {
          return role.id === 'development-team' || role.id === 'coordination';
        }).length > 0;
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/members/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/members/' + this.id;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url('+this.img+');';
      }
    },
    participation: {
      deps:['participations'],
      fn: function () {
        return this.participations.filter(function(p){ return p.event == app.me.selectedEvent; })[0];
      }
    },
    fbURL: {
      deps: ['facebook'],
      fn: function () {
        return 'http://www.facebook.com/'+this.facebook.username;
      }
    },

  },
  parse: function (attrs) {
    return attrs;
  },
});

// Member Model - member.js
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');


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

var Role = AmpState.extend({
  props: {
    id: 'string',
    isTeamLeader: 'boolean'
  }
});

var RoleCollection = AmpCollection.extend({
    model: Role
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
    roles: RoleCollection
  },
  session: {
    selected: ['boolean', true, false]
  },
  derived: {
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
        return 'background-image:url('+this.img+'?width=200);';
      }
    }
  },
  parse: function (attrs) {
    return attrs;
  },
});
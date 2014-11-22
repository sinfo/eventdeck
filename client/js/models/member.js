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
    roleIds: {
      deps: ['roles'],
      fn: function () {
        return this.roles.map(function (role){
          return role.id;
        });
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
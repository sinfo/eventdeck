/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');

var Communication = require('./communication');
var Comment = require('./comment');
var Participation = require('./participation');


var CommunicationCollection = AmpCollection.extend({
    model: Communication
});

var CommentCollection = AmpCollection.extend({
    model: Comment
});

var ParticipationCollection = AmpCollection.extend({
  model: Participation
});

module.exports = AmpModel.extend({

  props: {
    id: ['string'],
    name: ['string'],
    title: ['string'],
    description: ['string'],
    img: ['string'],
    storedImg: ['string'],
    contacts:['string'],
    updated:['string']
  },
  collections: {
    communications: CommunicationCollection,
    comments: CommentCollection,
    participations: ParticipationCollection
  },
  session: {
    selected: ['boolean', true, false]
  },
  derived: {
    thread: {
      deps: ['id'],
      fn: function () {
        return 'speaker-' + this.id;
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/speakers/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/speakers/' + this.id;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url('+this.img+');';
      }
    },
    commentsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/speakers/' + this.id + '/comments';
      }
    },
    communicationsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/speakers/' + this.id + '/communications';
      }
    },
    participation: {
      deps:['participations'],
      fn: function () {
        return this.participations.filter(function(p){ return p.event == app.me.selectedEvent; })[0];
      }
    },
    statusDetails: {
      deps: ['participations'],
      fn: function () {
        var self = this;
        var participations = self.participations.toJSON();
        var participation = participations.filter(function(p){
          return p.event == app.me.selectedEvent;
        })[0];

        var details = options.statuses.speaker.filter(function (status) {
          return participation && participation.status == status.name;
        })[0] || {};

        details.style = details && details.color && 'background-color:' + details.color;
        return details;
      },
    },
    descriptionHtml: {
      deps: ['description'],
      fn: function () {
        return this.description && marked(this.description) || '';
      },
    },
    contactsHtml: {
      deps: ['contacts'],
      fn: function () {
        return this.contacts && marked(this.contacts) || '';
      },
    },
  },
  toJSON: function () {
    return function () {
      var json = this.serialize();
      delete json.comments;
      delete json.communications;
      delete json.storedImg;
      return json;
    };
  }
});
/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');
//var Comment = require('./comment');

var Speaker = AmpState.extend({
  props: {
    id: ['string'],
    name: ['string'],
    position: ['string']
  }
});

var SpeakerCollection = AmpCollection.extend({
  model: Speaker
});

/*var CommentCollection = AmpCollection.extend({
    model: Comment
});*/

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    kind: ['string'],
    img: ['string'],
    place: ['string'],
    description: ['string'],
    date: ['date'],
    duration: ['date'],
    updated: ['date'],
    companies: ['array'],
  },
  collections: {
    speakers: SpeakerCollection,
    //comments: CommentCollection,
  },
  derived: {
    thread: {
      deps: ['id'],
      fn: function () {
        return 'session-' + this.id;
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/sessions/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/sessions/' + this.id;
      }
    },
    title: {
      deps: ['name'],
      fn: function () {
        return this.name;
      }
    },
    url: {
      deps: ['viewUrl'],
      fn: function () {
        return this.viewUrl;
      }
    },
    start: {
      deps: ['date'],
      fn: function () {
        return this.date;
      }
    },
    end: {
      deps: ['date', 'duration'],
      fn: function () {
        return this.date + this.duration;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url(' + this.img + ');';
      }
    },
/*  commentsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/sessions/' + this.id + '/comments';
      }
    }*/
  }
});
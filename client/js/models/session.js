/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');
var SpeakerDetails = require('./speaker');
var CompanyDetails = require('./company');
var Moment = require('moment');

//var Comment = require('./comment');
var _ = require('client/js/helpers/underscore');

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

var SpeakersDetailsCollection = AmpCollection.extend({
  model: SpeakerDetails
});

var CompaniesDetailsCollection = AmpCollection.extend({
  model: CompanyDetails
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
    speakersDetails: SpeakersDetailsCollection,
    companiesDetails: CompaniesDetailsCollection,
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
    start: {
      deps: ['date'],
      fn: function () {
        return new Date(this.date);
      }
    },
    startParsed: {
      deps: ['date'],
      fn: function() {
        var date = new Date(this.date);
        return new Moment(date).format('MMMM Do YYYY, HH:mm');  
      }
    },
    end: {
      deps: ['date', 'duration'],
      fn: function () {
        return new Date(this.date.getTime() + this.duration.getTime());
      }
    },
    endParsed: {
      deps: ['end'],
      fn: function() {
        var date = new Date(this.end);
        return new Moment(date).format('MMMM Do YYYY, HH:mm');  
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
  },
  parse: function (attrs) {
    console.log('parsing', attrs);
    attrs.date = new Date(attrs.date);
    attrs.duration = new Date(attrs.duration);
    return attrs;
  },
  serialize: function () {
    var res = this.getAttributes({props: true}, true);
    _.each(this._children, function (value, key) {
        res[key] = this[key].serialize && this[key].serialize() || this[key];
    }, this);
    _.each(this._collections, function (value, key) {
        res[key] = this[key].serialize && this[key].serialize() || this[key];
    }, this);

    delete res.speakersDetails;
    delete res.unread;

    return res;
  }

});
/*global app*/
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');
var SpeakerDetails = require('./speaker');
var CompanyDetails = require('./company');
var Moment = require('moment');
var config = require('client/js/helpers/clientconfig');

var _ = require('client/js/helpers/underscore');

var Speaker = AmpState.extend({
  props: {
    id: ['string'],
    name: ['string'],
    position: ['string']
  }
});

var Tickets = AmpState.extend({
  props: {
    needed: ['boolean'],
    start: ['date'],
    end: ['date'],
    max: ['number']
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
    surveyNeeded: ['boolean']
  },
  children:{
    tickets: Tickets
  },
  collections: {
    speakers: SpeakerCollection,
    speakersDetails: SpeakersDetailsCollection,
    companiesDetails: CompaniesDetailsCollection,
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
    descriptionHtml: {
      deps: ['description'],
      fn: function () {
        return this.description && marked(this.description) || '';
      },
    },
    ticketneeded: {
      deps: ['tickets.needed'],
      fn: function(){
        if(this.tickets.needed){
          return 'Required';
        }
        return 'Not required';

      }
    },
    usersApi: {
      deps: ['id'],
      fn: function () {
        return config.cannonUrl + '/tickets/' + this.id + '/users';
      }
    },
    waitingUsersApi: {
      deps: ['id'],
      fn: function () {
        return config.cannonUrl + '/tickets/' + this.id + '/waiting';
      }
    },
    confirmedUsersApi: {
      deps: ['id'],
      fn: function () {
        return config.cannonUrl + '/tickets/' + this.id + '/confirmed';
      }
    },
    surveyText: {
      deps: ['surveyNeeded'],
      fn: function () {
        return 'Survey ' + (this.surveyNeeded ? '' : 'not ') + 'needed.';
      },
      cache: false
    }
  },
  parse: function (attrs) {
    //console.log('parsing', attrs);
    attrs.date = new Date(attrs.date);
    attrs.duration = new Date(attrs.duration);
    attrs.updated = new Date(attrs.updated);

    if(attrs.tickets.start !== null){
      attrs.tickets.start = new Date(attrs.tickets.start);
    }
    if(attrs.tickets.end !== null){
      attrs.tickets.end = new Date(attrs.tickets.end);
    }

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
    delete res.companiesDetails;
    delete res.unread;

    return res;
  }

});

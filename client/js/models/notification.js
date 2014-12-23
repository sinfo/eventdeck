/*global app*/
var AmpState = require('ampersand-state');
var AmpIOModel = require('ampersand-io-model');
var timeSince = require('client/js/helpers/timeSince');
var options = require('options');

var events = {
  create: 'notify',
  fetch: 'notification-get',
  onFetch: 'notification-get-response'
};

var listeners = {};


module.exports= function(socket){

  var IOModel = AmpIOModel.extend(socket, {events: events, listeners: listeners});

  return AmpState.extend(new IOModel(), {
    props: {
      id: ['string'],
      thread: ['string'],
      source: ['string'],
      member: ['string'],
      description: ['string'],
      targets: ['array'],
      posted: ['string']
    },
    derived: {
      postedTimeSpan: {
        deps: ['posted'],
        fn: function () {
          return timeSince(this.posted);
        },
        cache: false
      },
      memberName: {
        deps: ['member'],
        fn: function () {
          app.members.getOrFetch(this.member, {all: true}, function (err, model) {
            return model.name;
          });
        }
      },
      unread: {
        deps: ['member'],
        fn: function() {
          
        }
      }
    }
  });
};

/*global app*/
var AmpState = require('ampersand-state');
var AmpIOModel = require('ampersand-io-model');
var timeSince = require('client/js/helpers/timeSince');
var threadUrl = require('client/js/helpers/threadUrl');
var options = require('options');
var log = require('bows')('io-notification');

module.exports = function(socket){

  return AmpIOModel.extend(socket, {

    events: {
      create: 'notify',
      fetch: 'notification-get',
      onFetch: 'notification-get-response'
    },

    listeners: {},

    props: {
      id: ['string'],
      thread: ['string'],
      source: ['string'],
      member: ['string'],
      description: ['string'],
      targets: ['array'],
      posted: ['string']
    },
    session: {
      unread: ['boolean']
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
      threadUrl: {
        deps: ['thread'],
        fn: function () {
          return threadUrl(this.thread);
        }
      }
    }
  });
};

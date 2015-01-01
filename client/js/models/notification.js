/*global app*/
var AmpState = require('ampersand-state');
var AmpIOModel = require('ampersand-io-model');
var timeSince = require('client/js/helpers/timeSince');
var threadUrl = require('client/js/helpers/threadUrl');
var options = require('options');
var log = require('bows')('io-notification');
var Member = require('./member');

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
      unread: ['boolean'],
      memberDetails: Member,
    },
    derived: {
      postedTimeSpan: {
        deps: ['posted'],
        fn: function () {
          return timeSince(this.posted);
        },
        cache: false
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

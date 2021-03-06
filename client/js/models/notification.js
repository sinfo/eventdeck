var AmpState = require('ampersand-state')
var AmpIOModel = require('ampersand-io-model')
var timeSince = require('../helpers/timeSince')
var threadUrl = require('../helpers/threadUrl')
var Member = require('./member')

var ThreadDetails = AmpState.extend({
  props: {
    name: 'string',
    img: 'string'
  }
})

module.exports = function (socket) {
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
      memberDetails: Member,
      threadDetails: ThreadDetails
    },
    derived: {
      postedTimeSpan: {
        deps: ['posted'],
        fn: function () {
          return timeSince(this.posted)
        },
        cache: false
      },
      threadUrl: {
        deps: ['thread'],
        fn: function () {
          return threadUrl(this.thread)
        }
      },
      threadKind: {
        deps: ['thread'],
        fn: function () {
          return this.thread.split('-')[0]
        }
      },
      threadId: {
        deps: ['thread'],
        fn: function () {
          return this.thread.substring(this.thread.indexOf('-') + 1)
        }
      }
    }
  })
}

/* global app */
var AmpModel = require('ampersand-model')
var AmpCollection = require('ampersand-collection')
var timeSince = require('../helpers/timeSince')
var options = require('../../../options')
var marked = require('../helpers/marked')
var _ = require('../helpers/underscore')

var Comment = require('./comment')

var CommentCollection = AmpCollection.extend({
  model: Comment
})

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    thread: ['string'],
    event: ['string'],
    kind: ['string'],
    member: ['string'],
    text: ['string'],
    status: ['string'],
    posted: ['string'],
    updated: ['string']
  },
  collections: {
    comments: CommentCollection
  },
  derived: {
    subthread: {
      deps: ['id'],
      fn: function () {
        return 'communication-' + this.id
      }
    },
    postedTimeSpan: {
      deps: ['posted'],
      fn: function () {
        return timeSince(this.posted)
      },
      cache: false
    },
    memberName: {
      deps: ['member'],
      fn: function () {
        app.members.getOrFetch(this.member, {all: true}, function (err, model) {
          if (err) throw err
          return model.name
        })
      }
    },
    statusDetails: {
      deps: ['status'],
      fn: function () {
        var self = this
        var details = options.statuses.communication.filter(function (status) {
          return status.id === self.status
        })[0]

        if (!details) {
          return
        }

        details.style = details.color && 'background-color:' + details.color

        return details
      }
    },
    textHtml: {
      deps: ['text'],
      fn: function () {
        return this.text && marked(this.text) || ''
      }
    },
    commentsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/communications/' + this.id + '/comments'
      }
    }
  },
  serialize: function () {
    var res = this.getAttributes({props: true}, true)
    _.each(this._children, function (value, key) {
      res[key] = this[key].serialize()
    }, this)
    _.each(this._collections, function (value, key) {
      res[key] = this[key].serialize()
    }, this)

    delete res.comments

    return res
  }
})

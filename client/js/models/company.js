/* global app */
var AmpModel = require('ampersand-model')
var AmpCollection = require('ampersand-collection')
var options = require('../../../options')
var marked = require('../helpers/marked')
var _ = require('../helpers/underscore')

var Communication = require('./communication')
var Comment = require('./comment')
var Participation = require('./participation')

var CommunicationCollection = AmpCollection.extend({
  model: Communication
})

var CommentCollection = AmpCollection.extend({
  model: Comment
})

var ParticipationCollection = AmpCollection.extend({
  model: Participation
})

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    unread: ['boolean'],
    name: ['string'],
    description: ['string'],
    img: ['string'],
    storedImg: ['string'],
    site: ['string'],
    status: ['status'],
    contacts: ['string'],
    history: ['string'],
    area: ['string'],
    updated: ['string']
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
        return 'company-' + this.id
      }
    },
    threadKind: {
      fn: function () {
        return 'company'
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id + '/edit'
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id
      }
    },
    templateUrl: {
      deps: ['id'],
      fn: function () {
        return '/templates/companies/' + this.id
      }
    },
    startupTemplateUrl: {
      deps: ['id'],
      fn: function () {
        return '/templates/startups/' + this.id
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url(' + this.storedImg + ');'
      }
    },
    commentsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/companies/' + this.id + '/comments'
      }
    },
    communicationsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/companies/' + this.id + '/communications'
      }
    },
    participation: {
      deps: ['participations'],
      fn: function () {
        return this.participations.filter(function (p) { return p.event === app.me.selectedEvent })[0]
      }
    },
    statusDetails: {
      deps: ['participations'],
      fn: function () {
        var self = this
        var participations = self.participations.toJSON()
        var participation = participations.filter(function (p) {
          return p.event === app.me.selectedEvent
        })[0]

        var details = options.statuses.company.filter(function (status) {
          return participation && participation.status === status.id
        })[0] || {}

        details.style = details && details.color && 'background-color:' + details.color
        return details
      }
    },
    descriptionHtml: {
      deps: ['description'],
      fn: function () {
        return this.description && marked(this.description) || ''
      }
    },
    contactsHtml: {
      deps: ['contacts'],
      fn: function () {
        return this.contacts && marked(this.contacts) || ''
      }
    },
    historyHtml: {
      deps: ['history'],
      fn: function () {
        return this.history && marked(this.history) || ''
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
    delete res.communications
    delete res.storedImg
    delete res.unread

    return res
  },
  parse: function (attrs) {
    attrs.participations = attrs.participations && attrs.participations.map(function (p) {
      p.threadKind = 'company'
      return p
    })
    return attrs
  }
})

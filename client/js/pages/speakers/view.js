/* global app */
var log = require('bows')('speakers')
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var CommunicationsView = require('client/js/views/communications')
var Communications = require('client/js/models/communications')
var CommentsView = require('client/js/views/comments')
var Comments = require('client/js/models/comments')
var ParticipationsView = require('client/js/views/participations')
var SubscriptionView = require('client/js/views/subscription')

module.exports = PageView.extend({
  pageTitle: 'View speaker',
  template: templates.pages.speakers.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.storedImg': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.title': {
      hook: 'title'
    },
    'model.contactsHtml': {
      type: 'innerHTML',
      hook: 'contacts'
    },
    'model.descriptionHtml': {
      type: 'innerHTML',
      hook: 'description'
    },
    'model.informationHtml': {
      type: 'innerHTML',
      hook: 'information'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
    'model.feedback': {
      hook: 'feedback'
    }
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick'
  },
  initialize: function (spec) {
    var self = this
    app.speakers.getOrFetch(spec.id, function (err, model) {
      if (err) {
        log.error('couldnt find a speaker with id: ' + spec.id)
      }
      self.model = model
      app.access(model)
      log('Got speaker', model.name)
    })
  },
  subviews: {
    participations: {
      container: '[data-hook=speaker-participations]',
      waitFor: 'model.participations',
      prepareView: function (el) {
        return new ParticipationsView({
          el: el,
          collection: this.model.participations
        })
      }
    },
    comments: {
      container: '[data-hook=speaker-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        var Comms = new Comments(this.model.commentsApi)
        return new CommentsView({
          el: el,
          collection: new Comms()
        })
      }
    },
    communications: {
      container: '[data-hook=speaker-communications]',
      waitFor: 'model.communicationsApi',
      prepareView: function (el) {
        var Comms = new Communications(this.model.communicationsApi)
        return new CommunicationsView({
          el: el,
          collection: new Comms()
        })
      }
    },
    subscription: {
      container: '[data-hook=speaker-subscription]',
      parent: this,
      waitFor: 'model.thread',
      prepareView: function (el) {
        var self = this
        return new SubscriptionView({
          el: el,
          model: self.model,
          parent: self
        })
      }
    }
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('speakers')
    }})
  }
})

/* global app */
var $ = require('jquery')
var threadUrl = require('client/js/helpers/threadUrl')
var log = require('bows')('communications')
var View = require('ampersand-view')
var templates = require('client/js/templates')
var ViewSwitcher = require('ampersand-view-switcher')
var CommunicationForm = require('client/js/forms/communication')
var Comments = require('client/js/models/comments')
var CommentsView = require('client/js/views/comments')
var _ = require('client/js/helpers/underscore')
var MemberBadge = require('client/js/views/memberBadge')

module.exports = View.extend({
  template: templates.cards.communication,
  render: function () {
    this.renderWithTemplate()
    this.viewContainer = this.queryByHook('view-container')
    this.switcher = new ViewSwitcher(this.viewContainer)

    this.handleViewClick()
  },
  events: {
    'click [data-hook~=initial-email]': 'handleInitialEmail',
    'click [data-hook~=action-delete]': 'handleRemoveClick',
    'click [data-hook~=action-edit]': 'handleEditClick',
    'click [data-hook~=action-view]': 'handleViewClick',
    'click [data-hook~=action-approve]': 'handleApproveClick',
    'click [data-hook~=action-review]': 'handleReviewClick'
  },
  handleInitialEmail: function () {
    console.log(app.config)
    window.open(app.config.apiUrl + '/api' + threadUrl(this.model.thread) + '/communications/' + this.model.id + '/view', '_blank')
  },
  handleRemoveClick: function () {
    if (window.confirm('Do you really want to delete this communication?')) {
      this.model.destroy({wait: true})
    }
    return false
  },
  handleEditClick: function () {
    var view = new EditCommunication({ model: this.model, parent: this })
    this.switcher.set(view)
    return false
  },
  handleViewClick: function () {
    var view = new ViewCommunication({ model: this.model, parent: this })
    this.switcher.set(view)
    return false
  },
  handleApproveClick: function () {
    this.model.save({ status: 'approved' }, {
      patch: true,
      wait: false,
      success: function () {
        log('communication approved')
      }
    })
    return false
  },
  handleReviewClick: function () {
    this.model.save({ status: 'reviewed' }, {
      patch: true,
      wait: false,
      success: function () {
        log('communication reviewed')
      }
    })
    return false
  }
})

var ViewCommunication = View.extend({
  template: templates.partials.communications.view,
  bindings: {
    'model.kind': '[data-hook~=kind]',
    'model.statusDetails.name': '[data-hook~=status]',
    'model.statusDetails.style': {
      type: 'attribute',
      hook: 'status',
      name: 'style'
    },
    'model.postedTimeSpan': '[data-hook~=posted]',
    'model.posted': {
      type: 'attribute',
      hook: 'posted',
      name: 'title'
    },
    'model.textHtml': {
      type: 'innerHTML',
      hook: 'text'
    },
    'model.memberName': '[data-hook~=member-name]'
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick',
    'click [data-hook~=toggle-comments]': 'toggleComments'
  },
  handleRemoveClick: function () {
    this.model.destroy()
    return false
  },
  toggleComments: function () {
    $(this.queryByHook('comments-area')).toggle()
  },
  render: function () {
    this.renderWithTemplate()
    if (app.me.isAdmin) {
      this.renderSubview(new AdminCommunication(), '[data-hook=admin-container]')
    }
    $(this.queryByHook('comments-area')).hide()
    if (this.model.kind !== 'Initial Email Paragraph') {
      $(this.queryByHook('initial-email')).hide()
    }

    var self = this
    setInterval(function () {
      $(self.queryByHook('toggle-comments')).text($(self.queryByHook('comments-list')).children('div').length + ' comments')
    }, 1000)
  },
  subviews: {
    member: {
      container: '[data-hook=member-container]',
      waitFor: 'model.member',
      prepareView: function (el) {
        var self = this
        return new MemberBadge({
          el: el,
          model: self.model
        })
      }
    },
    comments: {
      container: '[data-hook=communication-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        var Comms = new Comments(this.model.commentsApi)
        return new CommentsView({
          el: el,
          collection: new Comms()
        })
      }
    }
  }
})

var EditCommunication = View.extend({
  template: templates.partials.communications.edit,
  subviews: {
    form: {
      container: '[data-hook~=new-commmunication]',
      prepareView: function (el) {
        var self = this
        return new CommunicationForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data))
            if (!data) {
              return self.parent.handleViewClick()
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function () {
                log('communication saved', data)
                self.parent.handleViewClick()
              }
            })
          }
        })
      }
    }
  }
})

var AdminCommunication = View.extend({
  template: templates.partials.communications.admin
})

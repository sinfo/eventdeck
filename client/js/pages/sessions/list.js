
var log = require('bows')('sessions')
var PageView = require('../base')
var templates = require('../../templates')
var options = require('../../../../options')
var _ = require('underscore')
var Calendar = require('ampersand-fullcalendar-view')

module.exports = PageView.extend({
  pageTitle: 'Sessions',
  template: templates.pages.sessions.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',

    'click [data-hook~=hide]': 'hide'
  },
  initialize: function () {
    if (!this.collection.length) {
      return this.fetchCollection()
    }
  },
  fetchCollection: function () {
    var self = this
    log('Fetching sessions')
    this.collection.update()
    this.collection.fetch({success: function () {
      self.render()
    }})

    return false
  },
  render: function () {
    this._initializeSubviews()
    return PageView.prototype.render.apply(this, arguments)
  },
  hide: function () {
    if (!this.hidden) {
      this.queryByHook('awesome-sidebar').style.display = 'none'
      this.hidden = true
    } else {
      this.queryByHook('awesome-sidebar').style.display = 'block'
      this.hidden = false
    }
  },
  subviews: {
    calendar: {
      container: '[data-hook=sessions-list]',
      waitFor: 'collection.length',
      prepareView: function (el) {
        var events = this.collection.serialize().map(function (s) {
          s.title = s.name
          s.start = new Date(s.date)
          s.duration = new Date(s.duration)
          s.end = new Date(s.start.getTime() + s.duration.getTime())
          s.url = '/sessions/' + s.id
          s.color = _.find(options.kinds.sessions, function (o) {
            return s.kind === o.name
          }).color
          return s
        })

        return new Calendar({
          el: el,
          events: events,
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          }
        })
      }
    }
  }
})
